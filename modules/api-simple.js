// ===== MODULE API SIMPLIFIÉ - Admin MBA =====
// Gestion des routes API simplifiées (sans offres)

export class ApiModule {
  constructor() {
    this.env = null;
  }

  // Initialisation avec l'environnement
  init(env) {
    this.env = env;
  }

  // Route principale pour toutes les API
  async handleApiRequest(request, user, path) {
    try {
      console.log(`🔍 API Request: ${path} for user ${user.id}`);

      // Router les différentes API
      switch (path) {
        case '/api/conversions':
          return await this.getMyConversionsApi(request, user);
        
        case '/api/analytics':
          return await this.getAnalyticsApi(request, user);
        
        case '/api/profile':
          return await this.updateProfileApi(request, user);
        
        case '/api/change-password':
          return await this.changePasswordApi(request, user);
        
        case '/api/user-profile':
          return await this.getUserProfileApi(request, user);
        
        // Admin API endpoints
        case '/api/admin/users':
          return await this.getAdminUsersApi(request, user);
        
        default:
          if (path.startsWith('/api/admin/users/') && path.includes('/toggle-status')) {
            const userId = path.split('/')[4];
            return await this.toggleUserStatusApi(request, user, userId);
          }
          
          return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      return this.handleApiError(error);
    }
  }

  // API: Récupérer les conversions de l'utilisateur
  async getMyConversionsApi(request, user) {
    try {
      const url = new URL(request.url);
      const filters = this.parseApiFilters(url);
      
      // Filtrer par les offres assignées à l'utilisateur
      const userOffers = await this.env.AFFILIATE_DB.prepare(`
        SELECT offer_id FROM user_offers 
        WHERE user_id = ? AND is_active = 1
      `).bind(user.id).all();
      
      if (userOffers.results.length === 0) {
        return new Response(JSON.stringify({
          success: true,
          conversions: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const userOfferIds = userOffers.results.map(uo => uo.offer_id);
      const placeholders = userOfferIds.map(() => '?').join(',');
      
      let whereClause = `conv.offer_id IN (${placeholders})`;
      let params = [...userOfferIds];
      
      if (filters.offer_id) {
        whereClause += ' AND conv.offer_id = ?';
        params.push(filters.offer_id);
      }
      
      if (filters.start_date) {
        whereClause += ' AND conv.timestamp >= ?';
        params.push(filters.start_date);
      }
      
      if (filters.end_date) {
        whereClause += ' AND conv.timestamp <= ?';
        params.push(filters.end_date);
      }
      
      const offset = ((filters.page || 1) - 1) * (filters.limit || 50);
      
      const conversions = await this.env.AFFILIATE_DB.prepare(`
        SELECT 
          conv.id, conv.offer_id, conv.click_id, conv.conversion_value, 
          conv.conversion_data, conv.timestamp, conv.status, conv.revenue,
          o.nom as offer_name, o.network, o.payout
        FROM conversions conv
        LEFT JOIN offers o ON conv.offer_id = o.id
        WHERE ${whereClause}
        ORDER BY conv.timestamp DESC
        LIMIT ? OFFSET ?
      `).bind(...params, filters.limit || 50, offset).all();
      
      const total = await this.env.AFFILIATE_DB.prepare(`
        SELECT COUNT(*) as count FROM conversions conv WHERE ${whereClause}
      `).bind(...params).first();
      
      return new Response(JSON.stringify({
        success: true,
        conversions: conversions.results,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 50,
          total: total.count,
          pages: Math.ceil(total.count / (filters.limit || 50))
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Erreur récupération conversions:', error);
      return this.handleApiError(error, 'Failed to fetch conversions');
    }
  }

  // API: Analytics
  async getAnalyticsApi(request, user) {
    try {
      const url = new URL(request.url);
      const offerId = url.searchParams.get('offer_id');
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');
      
      const analytics = await this.getAnalytics(user.id, { offerId, startDate, endDate });
      return new Response(JSON.stringify({ analytics }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Erreur analytics:', error);
      return this.handleApiError(error, 'Failed to fetch analytics');
    }
  }

  // ===== MÉTHODES UTILITAIRES =====

  // Parser les filtres API
  parseApiFilters(url) {
    const filters = {
      search: url.searchParams.get('search'),
      network: url.searchParams.get('network'),
      category: url.searchParams.get('category'),
      country: url.searchParams.get('country'),
      min_payout: url.searchParams.get('min_payout'),
      max_payout: url.searchParams.get('max_payout'),
      sort: url.searchParams.get('sort') || 'updated',
      page: parseInt(url.searchParams.get('page')) || 1,
      limit: parseInt(url.searchParams.get('limit')) || 20,
      offer: url.searchParams.get('offer'),
      offer_id: url.searchParams.get('offer_id'),
      date: url.searchParams.get('date'),
      start_date: url.searchParams.get('start_date'),
      end_date: url.searchParams.get('end_date')
    };
    
    // Handle date filter
    if (filters.date) {
      const now = new Date();
      switch (filters.date) {
        case 'today':
          filters.start_date = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
          filters.end_date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
          break;
        case 'week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          filters.start_date = weekStart.toISOString();
          filters.end_date = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filters.start_date = monthStart.toISOString();
          filters.end_date = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
          break;
      }
    }
    
    return filters;
  }

  // Gestion des erreurs API
  handleApiError(error, message = 'API Error') {
    console.error(`❌ ${message}:`, error);
    return new Response(JSON.stringify({ 
      success: false,
      error: message,
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Récupérer les analytics
  async getAnalytics(userId, filters = {}) {
    const { offerId, startDate, endDate } = filters;
    
    let whereClause = '1=1';
    let params = [];
    
    if (offerId) {
      whereClause += ' AND conv.offer_id = ?';
      params.push(offerId);
    }
    
    if (startDate) {
      whereClause += ' AND conv.timestamp >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      whereClause += ' AND conv.timestamp <= ?';
      params.push(endDate);
    }
    
    const query = `
      SELECT 
        conv.offer_id,
        0 as clicks,
        COUNT(conv.id) as conversions,
        COALESCE(SUM(conv.revenue), 0) as revenue,
        COALESCE(SUM(conv.conversion_value), 0) as conversion_value,
        0 as conversion_rate
      FROM conversions conv
      WHERE ${whereClause}
      GROUP BY conv.offer_id
      ORDER BY conversions DESC
    `;
    
    const result = await this.env.AFFILIATE_DB.prepare(query).bind(...params).all();
    return result.results;
  }

  // ===== API PROFILE =====

  // API: Mettre à jour le profil utilisateur
  async updateProfileApi(request, user) {
    try {
      if (request.method !== 'PUT') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await request.json();
      console.log('📝 API /api/profile: Mise à jour du profil pour l\'utilisateur', user.id);

      // Construire la requête de mise à jour dynamiquement
      const updateFields = [];
      const values = [];

      if (data.firstName !== undefined) {
        updateFields.push('first_name = ?');
        values.push(data.firstName);
      }

      if (data.lastName !== undefined) {
        updateFields.push('last_name = ?');
        values.push(data.lastName);
      }

      if (data.email !== undefined) {
        // Vérifier si l'email n'est pas déjà utilisé par un autre utilisateur
        const existingEmail = await this.env.AFFILIATE_DB.prepare(`
          SELECT id FROM users WHERE email = ? AND id != ?
        `).bind(data.email, user.id).first();

        if (existingEmail) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Email already exists'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        updateFields.push('email = ?');
        values.push(data.email);
      }

      if (data.phone !== undefined) {
        updateFields.push('phone = ?');
        values.push(data.phone);
      }

      if (data.website !== undefined) {
        updateFields.push('website = ?');
        values.push(data.website);
      }

      if (data.address !== undefined) {
        updateFields.push('address = ?');
        values.push(data.address);
      }

      if (data.postalCode !== undefined) {
        updateFields.push('postal_code = ?');
        values.push(data.postalCode);
      }

      if (data.city !== undefined) {
        updateFields.push('city = ?');
        values.push(data.city);
      }

      if (data.country !== undefined) {
        updateFields.push('country = ?');
        values.push(data.country);
      }

      if (data.motivation !== undefined) {
        updateFields.push('motivation = ?');
        values.push(data.motivation);
      }

      if (updateFields.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No fields to update'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Ajouter updated_at
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(user.id);

      // Exécuter la mise à jour
      await this.env.AFFILIATE_DB.prepare(`
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).bind(...values).run();

      console.log('✅ Profil mis à jour pour l\'utilisateur', user.id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Profile updated successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API updateProfile:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to update profile'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Changer le mot de passe
  async changePasswordApi(request, user) {
    try {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { currentPassword, newPassword } = await request.json();
      console.log('🔐 API /api/change-password: Changement de mot de passe pour l\'utilisateur', user.id);

      // Récupérer le hash du mot de passe actuel
      const userData = await this.env.AFFILIATE_DB.prepare(`
        SELECT password_hash FROM users WHERE id = ?
      `).bind(user.id).first();

      if (!userData) {
        return new Response(JSON.stringify({
          success: false,
          error: 'User not found'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Vérifier le mot de passe actuel
      const authModule = new (await import('./auth.js')).AuthModule();
      authModule.init(this.env);
      
      const isCurrentPasswordValid = await authModule.verifyPassword(currentPassword, userData.password_hash);
      
      if (!isCurrentPasswordValid) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Current password is incorrect'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Valider le nouveau mot de passe
      if (!authModule.validatePassword(newPassword)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Password must be at least 6 characters long'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Hasher le nouveau mot de passe
      const newPasswordHash = await authModule.hashPassword(newPassword);

      // Mettre à jour le mot de passe
      await this.env.AFFILIATE_DB.prepare(`
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(newPasswordHash, user.id).run();

      console.log('✅ Mot de passe changé pour l\'utilisateur', user.id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Password changed successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API changePassword:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to change password'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Récupérer le profil complet de l'utilisateur
  async getUserProfileApi(request, user) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('👤 API /api/user-profile: Récupération du profil pour l\'utilisateur', user.id);

      // Récupérer toutes les données de l'utilisateur
      const userData = await this.env.AFFILIATE_DB.prepare(`
        SELECT 
          id, username, email, role, permissions, is_active,
          created_at, updated_at, last_login,
          first_name, last_name, phone, address, postal_code, city, country,
          account_type, website, referral_code, motivation
        FROM users 
        WHERE id = ? AND is_active = 1
      `).bind(user.id).first();

      if (!userData) {
        return new Response(JSON.stringify({
          success: false,
          error: 'User not found'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('✅ Profil récupéré pour l\'utilisateur', user.id);

      return new Response(JSON.stringify({
        success: true,
        user: userData
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getUserProfile:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get user profile'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ===== ADMIN API METHODS =====

  // API: Récupérer tous les utilisateurs (Admin seulement)
  async getAdminUsersApi(request, user) {
    try {
      // Vérifier que l'utilisateur est admin
      if (user.role !== 'admin') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Access denied. Admin role required.'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const users = await this.env.AFFILIATE_DB.prepare(`
        SELECT 
          id, username, email, role, is_active, created_at, last_login,
          first_name, last_name, phone, address, postal_code, city, country,
          account_type, website, referral_code, motivation
        FROM users 
        ORDER BY created_at DESC
      `).all();

      return new Response(JSON.stringify({
        success: true,
        users: users.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getAdminUsers:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get users'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Toggle statut utilisateur (Admin seulement)
  async toggleUserStatusApi(request, user, userId) {
    try {
      // Vérifier que l'utilisateur est admin
      if (user.role !== 'admin') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Access denied. Admin role required.'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        // Récupérer le statut actuel
        const currentUser = await this.env.AFFILIATE_DB.prepare(`
          SELECT is_active FROM users WHERE id = ?
        `).bind(userId).first();

        if (!currentUser) {
          return new Response(JSON.stringify({
            success: false,
            error: 'User not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Toggle le statut
        const newStatus = currentUser.is_active ? 0 : 1;
        
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(newStatus, userId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'User status updated successfully',
          newStatus: newStatus === 1 ? 'active' : 'inactive'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API toggleUserStatus:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to update user status'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
