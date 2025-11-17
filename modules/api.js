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
        
        case '/api/schools':
          return await this.getSchoolsApi(request, user);
        
        case '/api/programs':
          return await this.getProgramsApi(request, user);
        
        case '/api/classes':
          return await this.getClassesApi(request, user);
        
        case '/api/class-representatives':
          return await this.getClassRepresentativesApi(request, user);
        
        case '/api/videos':
          return await this.getVideosApi(request, user);
        
        case '/api/video-tags':
          return await this.getVideoTagsApi(request, user);
        
        case '/api/courses':
          return await this.getCoursesApi(request, user);
        
        case '/api/modules':
          return await this.getModulesApi(request, user);
        
        case '/api/tags':
          return await this.getTagsApi(request, user);
        
        case '/api/reclamations':
          return await this.getReclamationsApi(request, user);
        
        case '/api/dashboard':
          return await this.getDashboardApi(request, user);
        
        case '/api/tafs':
          return await this.getTafsApi(request, user);
        
        case '/api/school-config':
          return await this.getSchoolConfigApi(request, user);
        
        case '/api/comments':
          return await this.getCommentsApi(request, user);
        
        case '/api/taf-feedbacks':
          return await this.getTafFeedbacksApi(request, user);
        
        case '/api/taf-feedbacks/generate-evaluation':
          return await this.generateEvaluationApi(request, user);
        
        default:
          if (path.startsWith('/api/admin/users/') && path.includes('/toggle-status')) {
            const userId = path.split('/')[4];
            return await this.toggleUserStatusApi(request, user, userId);
          }
          if (path.startsWith('/api/programs/') && path.split('/').length === 4) {
            const programId = path.split('/')[3];
            return await this.getProgramByIdApi(request, user, programId);
          }
          if (path.startsWith('/api/videos/') && path.split('/').length === 4) {
            const videoId = path.split('/')[3];
            return await this.getVideoByIdApi(request, user, videoId);
          }
          if (path.startsWith('/api/videos/') && path.includes('/translations')) {
            const videoId = path.split('/')[3];
            return await this.getVideoTranslationsApi(request, user, videoId);
          }
          if (path.startsWith('/api/videos/') && path.includes('/programs')) {
            const videoId = path.split('/')[3];
            return await this.getVideoProgramsApi(request, user, videoId);
          }
          if (path.startsWith('/api/videos/') && path.includes('/speakers')) {
            const videoId = path.split('/')[3];
            return await this.getVideoSpeakersApi(request, user, videoId);
          }
          if (path.startsWith('/api/courses/') && path.split('/').length === 4) {
            const courseId = path.split('/')[3];
            return await this.getCourseByIdApi(request, user, courseId, this.env);
          }
          if (path.startsWith('/api/tafs/') && path.split('/').length === 4) {
            // Les routes /api/tafs/:id sont gérées dans getTafsApi
            return await this.getTafsApi(request, user);
          }
          if (path === '/api/speakers') {
            return await this.getSpeakersApi(request, user);
          }
          if (path.startsWith('/api/speakers/') && path.split('/').length === 4) {
            const speakerId = path.split('/')[3];
            return await this.getSpeakerByIdApi(request, user, speakerId);
          }
          if (path === '/api/upload') {
            return await this.uploadFileApi(request, user);
          }
          if (path === '/api/members') {
            return await this.getMembersApi(request, user);
          }
          if (path === '/api/school-fields') {
            return await this.getSchoolFieldsApi(request, user);
          }
          if (path === '/api/member-schools') {
            return await this.getMemberSchoolsApi(request, user);
          }
          if (path === '/api/schools') {
            return await this.getSchoolsApi(request, user);
          }
          if (path === '/api/quizzes') {
            return await this.getQuizzesApi(request, user);
          }
          if (path.startsWith('/api/schools/') && path.split('/').length === 4) {
            const schoolId = path.split('/')[3];
            return await this.getSchoolByIdApi(request, user, schoolId);
          }
          if (path.startsWith('/api/schools/') && path.split('/').length === 5 && path.split('/')[4] === 'admins') {
            const schoolId = path.split('/')[3];
            return await this.getSchoolAdminsApi(request, user, schoolId);
          }
          if (path.startsWith('/api/quizzes/') && path.split('/').length === 4) {
            const quizId = path.split('/')[3];
            return await this.getQuizByIdApi(request, user, quizId);
          }
          if (path.startsWith('/api/quizzes/') && path.split('/').length === 5 && path.split('/')[4] === 'participants') {
            const quizId = path.split('/')[3];
            return await this.getQuizParticipantsApi(request, user, quizId);
          }
          if (path.startsWith('/api/quizzes/') && path.split('/').length === 5 && path.split('/')[4] === 'questions') {
            const quizId = path.split('/')[3];
            return await this.getQuizQuestionsApi(request, user, quizId);
          }
          if (path.startsWith('/api/quiz-questions/') && path.split('/').length === 4) {
            const questionId = path.split('/')[3];
            return await this.getQuizQuestionByIdApi(request, user, questionId);
          }
          if (path.startsWith('/api/quizzes/') && path.split('/').length === 5 && path.split('/')[4] === 'attempt') {
            const quizId = path.split('/')[3];
            return await this.getQuizAttemptApi(request, user, quizId);
          }
          if (path.startsWith('/api/quiz-attempts/') && path.split('/').length === 4) {
            const attemptId = path.split('/')[3];
            return await this.getQuizAttemptByIdApi(request, user, attemptId);
          }
          if (path.startsWith('/api/quiz-attempts/') && path.split('/').length === 5 && path.split('/')[4] === 'results') {
            const attemptId = path.split('/')[3];
            return await this.getQuizAttemptResultsApi(request, user, attemptId);
          }
          if (path.startsWith('/api/quiz-answers/') && path.split('/').length === 5 && path.split('/')[4] === 'correction') {
            const answerId = path.split('/')[3];
            return await this.getQuizAnswerCorrectionApi(request, user, answerId);
          }
          if (path === '/api/classes') {
            return await this.getClassesApi(request, user);
          }
          if (path.startsWith('/api/classes/') && path.split('/').length === 4) {
            const classId = path.split('/')[3];
            return await this.getClassByIdApi(request, user, classId);
          }
          if (path === '/api/class-representatives') {
            return await this.getClassRepresentativesApi(request, user);
          }
          if (path.startsWith('/api/class-representatives/') && path.split('/').length === 4) {
            const repId = path.split('/')[3];
            return await this.getClassRepresentativeByIdApi(request, user, repId);
          }
          if (path.startsWith('/api/member-status/')) {
            return await this.getMemberStatusApi(request, user);
          }
          if (path.startsWith('/api/school-config/')) {
            return await this.getSchoolConfigApi(request, user);
          }
          
          if (path.startsWith('/api/taf-feedbacks/')) {
            return await this.getTafFeedbacksApi(request, user);
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


  // ===== PROGRAMS API =====

  // API: Récupérer tous les programmes
  async getProgramsApi(request, user) {
    try {
      if (request.method === 'GET') {
        const programs = await this.env.AFFILIATE_DB.prepare(`
          SELECT p.id, p.code, p.title, p.description, p.school_id, p.created_at,
                 s.name as school_name
          FROM programs p
          LEFT JOIN schools s ON p.school_id = s.id
          ORDER BY p.created_at DESC
        `).all();

        return new Response(JSON.stringify({
          success: true,
          programs: programs.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const { code, title, description, school_id } = await request.json();

        if (!code || !title || !school_id) {
      return new Response(JSON.stringify({
        success: false,
            error: 'Code, title and school are required'
        }), {
            status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

        const result = await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO programs (code, title, description, school_id, created_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(code, title, description || null, school_id).run();

      return new Response(JSON.stringify({
          success: true,
          message: 'Program created successfully',
          programId: result.meta.last_row_id
      }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getPrograms:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage programs'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'un programme spécifique par ID
  async getProgramByIdApi(request, user, programId) {
    try {
      if (request.method === 'GET') {
        const program = await this.env.AFFILIATE_DB.prepare(`
          SELECT p.id, p.code, p.title, p.description, p.school_id, p.created_at,
                 s.name as school_name
          FROM programs p
          LEFT JOIN schools s ON p.school_id = s.id
          WHERE p.id = ?
        `).bind(programId).first();

        if (!program) {
        return new Response(JSON.stringify({
          success: false,
            error: 'Program not found'
        }), {
            status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
        
        return new Response(JSON.stringify({ 
          success: true, 
          program
        }), { 
          headers: { 'Content-Type': 'application/json' } 
        });
      }

      if (request.method === 'PUT') {
        const { code, title, description, school_id } = await request.json();

        if (!code || !title || !school_id) {
      return new Response(JSON.stringify({
        success: false,
            error: 'Code, title and school are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE programs 
          SET code = ?, title = ?, description = ?, school_id = ?
          WHERE id = ?
        `).bind(code, title, description || null, school_id, programId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Program updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'DELETE') {
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM programs WHERE id = ?
        `).bind(programId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Program deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getProgramById:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage program'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ===== VIDEOS API =====

  // API: Gestion des vidéos
  async getVideosApi(request, user) {
    try {
      if (request.method === 'GET') {
        const videos = await this.env.AFFILIATE_DB.prepare(`
          SELECT v.id, v.video_url, v.video_source, v.status, v.thumbnail_url, 
                 v.duration_seconds, v.views_count, v.likes_count, v.created_at,
                 s.name as school_name,
                 -- Récupérer le titre de la première traduction
                 (SELECT title FROM video_translations WHERE video_id = v.id LIMIT 1) as title,
                 -- Récupérer les langues disponibles
                 GROUP_CONCAT(DISTINCT vt.language) as languages,
                 -- Récupérer les programmes
                 GROUP_CONCAT(DISTINCT p.title) as programs,
                 -- Récupérer les speakers
                 GROUP_CONCAT(DISTINCT CONCAT(sp.first_name, ' ', sp.last_name)) as speakers
          FROM videos v
          LEFT JOIN schools s ON v.school_id = s.id
          LEFT JOIN video_translations vt ON v.id = vt.video_id
          LEFT JOIN video_programs vp ON v.id = vp.video_id
          LEFT JOIN programs p ON vp.program_id = p.id
          LEFT JOIN video_speakers vs ON v.id = vs.video_id
          LEFT JOIN speakers sp ON vs.speaker_id = sp.id
          GROUP BY v.id
          ORDER BY v.created_at DESC
        `).all();

        // Process videos to include arrays for languages, programs, and speakers
        const processedVideos = videos.results.map(video => ({
          ...video,
          languages: video.languages ? video.languages.split(',') : [],
          programs: video.programs ? video.programs.split(',') : [],
          speakers: video.speakers ? video.speakers.split(',') : []
        }));

        return new Response(JSON.stringify({
          success: true,
          videos: processedVideos
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const { video_url, video_source, status, school_id, program_ids, speaker_ids, thumbnail_url, duration_seconds, translations, tags } = await request.json();
        
        console.log('🎬 Creating video with data:', { video_url, video_source, status, school_id, program_ids, translations });

        if (!video_url || !video_source || !school_id) {
      return new Response(JSON.stringify({
        success: false,
            error: 'Video URL, source and school are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Insert video
        console.log('📝 Inserting video...');
        const videoResult = await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO videos (video_url, video_source, status, school_id, 
                            thumbnail_url, duration_seconds, user_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(video_url, video_source, status, school_id, 
                thumbnail_url || null, duration_seconds || null, user.id).run();

        const videoId = videoResult.meta.last_row_id;
        console.log('✅ Video created with ID:', videoId);

        // Insert translations
        if (translations && translations.length > 0) {
          console.log('🌍 Inserting translations:', translations);
          for (const translation of translations) {
            // Always insert French (default language) even if empty
            // For other languages, only insert if they have a title
            const shouldInsert = (translation.language === 'fr') || translation.title;
            
            if (shouldInsert) {
              await this.env.AFFILIATE_DB.prepare(`
                INSERT INTO video_translations (video_id, language, title, description, subtitles_url)
                VALUES (?, ?, ?, ?, ?)
              `).bind(videoId, translation.language, translation.title || '', 
                      translation.description || '', translation.subtitles_url || '').run();
            }
          }
        }

        // Insert video-program relationships
        if (program_ids && program_ids.length > 0) {
          console.log('📚 Inserting program relationships:', program_ids);
          for (const programId of program_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO video_programs (video_id, program_id)
              VALUES (?, ?)
            `).bind(videoId, programId).run();
          }
        }

        // Insert video-speaker relationships
        if (speaker_ids && speaker_ids.length > 0) {
          console.log('👥 Inserting speaker relationships:', speaker_ids);
          for (const speakerId of speaker_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO video_speakers (video_id, speaker_id)
              VALUES (?, ?)
            `).bind(videoId, speakerId).run();
          }
        }

        // Insert tags
        if (tags && tags.length > 0) {
          for (const tagId of tags) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO tag_relations (entity_type, entity_id, tag_id)
              VALUES (?, ?, ?)
            `).bind('video', videoId, tagId).run();
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Video created successfully',
          videoId: videoId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getVideos:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage videos: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'une vidéo spécifique par ID
  async getVideoByIdApi(request, user, videoId) {
    try {
      if (request.method === 'GET') {
        const video = await this.env.AFFILIATE_DB.prepare(`
          SELECT v.*, s.name as school_name, p.title as program_title
          FROM videos v
          LEFT JOIN schools s ON v.school_id = s.id
          LEFT JOIN programs p ON v.program_id = p.id
          WHERE v.id = ?
        `).bind(videoId).first();

        if (!video) {
        return new Response(JSON.stringify({
          success: false,
            error: 'Video not found'
        }), {
            status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

        return new Response(JSON.stringify({
          success: true,
          video
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'PUT') {
        const { video_url, video_source, status, school_id, program_ids, speaker_ids, thumbnail_url, duration_seconds, translations, tags } = await request.json();

        if (!video_url || !video_source || !school_id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Video URL, source and school are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Update video
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE videos 
          SET video_url = ?, video_source = ?, status = ?, school_id = ?,
              thumbnail_url = ?, duration_seconds = ?
          WHERE id = ?
        `).bind(video_url, video_source, status, school_id, 
                thumbnail_url, duration_seconds, videoId).run();

        // Update translations
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM video_translations WHERE video_id = ?
        `).bind(videoId).run();

        if (translations && translations.length > 0) {
          for (const translation of translations) {
            // Always insert French (default language) even if empty
            // For other languages, only insert if they have a title
            const shouldInsert = (translation.language === 'fr') || translation.title;
            
            if (shouldInsert) {
              await this.env.AFFILIATE_DB.prepare(`
                INSERT INTO video_translations (video_id, language, title, description, subtitles_url)
                VALUES (?, ?, ?, ?, ?)
              `).bind(videoId, translation.language, translation.title || '', 
                      translation.description || '', translation.subtitles_url || '').run();
            }
          }
        }

        // Update video-program relationships
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM video_programs WHERE video_id = ?
        `).bind(videoId).run();

        if (program_ids && program_ids.length > 0) {
          for (const programId of program_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO video_programs (video_id, program_id)
              VALUES (?, ?)
            `).bind(videoId, programId).run();
          }
        }

        // Update video-speaker relationships
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM video_speakers WHERE video_id = ?
        `).bind(videoId).run();

        if (speaker_ids && speaker_ids.length > 0) {
          for (const speakerId of speaker_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO video_speakers (video_id, speaker_id)
              VALUES (?, ?)
            `).bind(videoId, speakerId).run();
          }
        }

        // Update tags
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM tag_relations WHERE entity_type = 'video' AND entity_id = ?
        `).bind(videoId).run();

        if (tags && tags.length > 0) {
          for (const tagId of tags) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO tag_relations (entity_type, entity_id, tag_id)
              VALUES (?, ?, ?)
            `).bind('video', videoId, tagId).run();
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Video updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'DELETE') {
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM videos WHERE id = ?
        `).bind(videoId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Video deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getVideoById:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage video'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Récupérer les traductions d'une vidéo
  async getVideoTranslationsApi(request, user, videoId) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const translations = await this.env.AFFILIATE_DB.prepare(`
        SELECT language, title, description, subtitles_url
        FROM video_translations 
        WHERE video_id = ?
        ORDER BY language
      `).bind(videoId).all();

      return new Response(JSON.stringify({
        success: true,
        translations: translations.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getVideoTranslations:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get video translations'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Récupérer les tags vidéo
  async getVideoTagsApi(request, user) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const tags = await this.env.AFFILIATE_DB.prepare(`
        SELECT id, name, slug
        FROM tags 
        ORDER BY name ASC
      `).all();

      return new Response(JSON.stringify({
        success: true,
        tags: tags.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur API getVideoTags:', error);
        return new Response(JSON.stringify({
          success: false,
        error: 'Failed to get video tags'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Récupérer les speakers d'une vidéo
  async getVideoSpeakersApi(request, user, videoId) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const speakers = await this.env.AFFILIATE_DB.prepare(`
        SELECT s.id, s.first_name, s.last_name, s.position, s.photo_url
        FROM video_speakers vs
        JOIN speakers s ON vs.speaker_id = s.id
        WHERE vs.video_id = ?
        ORDER BY s.last_name ASC, s.first_name ASC
      `).bind(videoId).all();

      return new Response(JSON.stringify({
        success: true,
        speakers: speakers.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getVideoSpeakers:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get video speakers'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Récupérer les programmes d'une vidéo
  async getVideoProgramsApi(request, user, videoId) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const programs = await this.env.AFFILIATE_DB.prepare(`
        SELECT p.id, p.title, p.code, s.name as school_name
        FROM video_programs vp
        JOIN programs p ON vp.program_id = p.id
        JOIN schools s ON p.school_id = s.id
        WHERE vp.video_id = ?
        ORDER BY p.title ASC
      `).bind(videoId).all();

      return new Response(JSON.stringify({
        success: true,
        programs: programs.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getVideoPrograms:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get video programs'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Récupérer speakers et programmes par école
  async getSchoolDataApi(request, user, schoolId) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Récupérer les programmes de l'école
      const programs = await this.env.AFFILIATE_DB.prepare(`
        SELECT id, title, code, description
        FROM programs 
        WHERE school_id = ?
        ORDER BY title ASC
      `).bind(schoolId).all();

      // Récupérer les speakers de l'école
      const speakers = await this.env.AFFILIATE_DB.prepare(`
        SELECT id, first_name, last_name, position, photo_url
        FROM speakers 
        WHERE school_id = ?
        ORDER BY last_name ASC, first_name ASC
      `).bind(schoolId).all();

      return new Response(JSON.stringify({
        success: true,
        programs: programs.results || [],
        speakers: speakers.results || []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getSchoolData:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get school data'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion des speakers
  async getSpeakersApi(request, user) {
    try {
      if (request.method === 'GET') {
        const speakers = await this.env.AFFILIATE_DB.prepare(`
          SELECT s.*, sch.name as school_name
          FROM speakers s
          LEFT JOIN schools sch ON s.school_id = sch.id
          ORDER BY s.last_name ASC, s.first_name ASC
        `).all();

        return new Response(JSON.stringify({
          success: true,
          speakers: speakers.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const { first_name, last_name, photo_url, linkedin_url, position, bio, school_id } = await request.json();

        if (!last_name || !school_id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Last name and school are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const speakerResult = await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO speakers (first_name, last_name, photo_url, linkedin_url, position, bio, school_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(first_name, last_name, photo_url, linkedin_url, position, bio, school_id).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Speaker created successfully',
          speakerId: speakerResult.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API getSpeakers:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage speakers'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'un speaker spécifique (PUT/DELETE)
  async getSpeakerByIdApi(request, user, speakerId) {
    try {
      console.log('🔧 getSpeakerByIdApi called for speaker:', speakerId, 'method:', request.method);
      
      if (request.method === 'PUT') {
        const { first_name, last_name, photo_url, linkedin_url, position, bio, school_id } = await request.json();
        console.log('📝 Updating speaker with data:', { first_name, last_name, school_id });

        const result = await this.env.AFFILIATE_DB.prepare(`
          UPDATE speakers 
          SET first_name = ?, last_name = ?, photo_url = ?, linkedin_url = ?, 
              position = ?, bio = ?, school_id = ?
          WHERE id = ?
        `).bind(first_name, last_name, photo_url, linkedin_url, position, bio, school_id, speakerId).run();

        console.log('✅ Speaker update result:', result);

        return new Response(JSON.stringify({
          success: true,
          message: 'Speaker updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'DELETE') {
        const result = await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM speakers WHERE id = ?
        `).bind(speakerId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Speaker deleted successfully'
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
      console.error('❌ Erreur API getSpeakerByIdApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage speaker'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Upload de fichiers vers R2
  async uploadFileApi(request, user) {
    try {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const formData = await request.formData();
      const file = formData.get('file');
      const type = formData.get('type') || 'speakers'; // speakers, videos, etc.

      if (!file) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No file provided'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'File type not allowed. Only JPEG, PNG, GIF, and WebP are allowed.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Vérifier la taille (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return new Response(JSON.stringify({
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Générer le nom de fichier avec structure WordPress (année/mois/jour)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      // Générer un nom unique avec format: id_ecole-id_user-uniqueid
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop();
      
      // Pour les speakers, on utilise l'école de l'utilisateur (par défaut 1)
      const schoolId = user.school_id || 1;
      const fileName = `${schoolId}-${user.id}-${timestamp}.${fileExtension}`;
      
      // Chemin complet : type/année/mois/jour/nom_fichier
      const filePath = `${type}/${year}/${month}/${day}/${fileName}`;

      // Upload vers R2
      const arrayBuffer = await file.arrayBuffer();
      await this.env.MBA_STORAGE.put(filePath, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      // Générer l'URL publique avec STATIC_URL
      const staticUrl = this.env.STATIC_URL || `https://pub-${this.env.MBA_STORAGE.accountId}.r2.dev`;
      const publicUrl = `${staticUrl}/${filePath}`;

      return new Response(JSON.stringify({
        success: true,
        message: 'File uploaded successfully',
        url: publicUrl,
        path: filePath,
        size: file.size,
        type: file.type
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur API uploadFile:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to upload file'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }


  // API: Gestion des membres
  async getMembersApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer les membres avec pagination et filtres
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 50;
        const search = url.searchParams.get('search') || '';
        const schoolId = url.searchParams.get('school_id');
        const programId = url.searchParams.get('program_id');
        const classId = url.searchParams.get('class_id');
        const membreId = url.searchParams.get('membre_id');
        const status = url.searchParams.get('status');
        
        let query = `
          SELECT 
            m.*,
            s.name as school_name,
            ms.role as school_role,
            ms.status as school_status,
            ms.enrollment_date,
            GROUP_CONCAT(DISTINCT msf.field_name || ':' || msf.field_value) as custom_fields,
            GROUP_CONCAT(DISTINCT p.title) as programs,
            GROUP_CONCAT(DISTINCT c.title) as classes
          FROM membres m
          LEFT JOIN membres_schools ms ON m.id = ms.membre_id
          LEFT JOIN schools s ON ms.school_id = s.id
          LEFT JOIN membres_school_fields msf ON m.id = msf.membre_id
          LEFT JOIN membres_programs mp ON m.id = mp.membre_id
          LEFT JOIN programs p ON mp.program_id = p.id
          LEFT JOIN membres_classes mc ON m.id = mc.membre_id
          LEFT JOIN classes c ON mc.class_id = c.id
          WHERE 1=1
        `;
        
        const params = [];
        
        if (schoolId) {
          query += ` AND ms.school_id = ?`;
          params.push(schoolId);
        }
        
        if (programId) {
          query += ` AND mp.program_id = ?`;
          params.push(programId);
        }
        
        if (classId) {
          query += ` AND mc.class_id = ?`;
          params.push(classId);
        }
        
        if (membreId) {
          query += ` AND m.id = ?`;
          params.push(membreId);
        }
        
        if (status !== null && status !== '') {
          query += ` AND m.is_active = ?`;
          params.push(parseInt(status));
        }
        
        if (search) {
          query += ` AND (
            m.first_name LIKE ? OR 
            m.last_name LIKE ? OR 
            m.email LIKE ? OR
            m.phone LIKE ?
          )`;
          const searchTerm = `%${search}%`;
          params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        query += ` GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, (page - 1) * limit);
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(...params).all();
        
        // Compter le total
        let countQuery = `
          SELECT COUNT(DISTINCT m.id) as total
          FROM membres m
          LEFT JOIN membres_schools ms ON m.id = ms.membre_id
          LEFT JOIN membres_programs mp ON m.id = mp.membre_id
          LEFT JOIN membres_classes mc ON m.id = mc.membre_id
          WHERE 1=1
        `;
        const countParams = [];
        
        if (schoolId) {
          countQuery += ` AND ms.school_id = ?`;
          countParams.push(schoolId);
        }
        
        if (programId) {
          countQuery += ` AND mp.program_id = ?`;
          countParams.push(programId);
        }
        
        if (classId) {
          countQuery += ` AND mc.class_id = ?`;
          countParams.push(classId);
        }
        
        if (membreId) {
          countQuery += ` AND m.id = ?`;
          countParams.push(membreId);
        }
        
        if (search) {
          countQuery += ` AND (
            m.first_name LIKE ? OR 
            m.last_name LIKE ? OR 
            m.email LIKE ? OR
            m.phone LIKE ?
          )`;
          const searchTerm = `%${search}%`;
          countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        const countResult = await this.env.AFFILIATE_DB.prepare(countQuery).bind(...countParams).first();
        
        return new Response(JSON.stringify({
          success: true,
          members: result.results,
          pagination: {
            page,
            limit,
            total: countResult.total,
            pages: Math.ceil(countResult.total / limit)
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        const data = await request.json();
        const { first_name, last_name, email, phone, password, school_id, school_role, program_ids, class_ids } = data;
        
        if (!first_name || !last_name || !email || !password) {
          return new Response(JSON.stringify({
            success: false,
            error: 'First name, last name, email and password are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Check if email already exists
        const existingMember = await this.env.AFFILIATE_DB.prepare(`
          SELECT id FROM membres WHERE email = ?
        `).bind(email).first();
        
        if (existingMember) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Email already exists'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Hash the password
        const crypto = await import('crypto');
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        
        // Insert new member
        const insertResult = await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO membres (first_name, last_name, email, phone, password_hash, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 1, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `).bind(first_name, last_name, email, phone, passwordHash).run();
        
        const memberId = insertResult.meta.last_row_id;
        
        // Add to school (use provided school_id or default to 1)
        const finalSchoolId = school_id || 1;
        const finalSchoolRole = school_role || 'student';
        await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO membres_schools (membre_id, school_id, role, status, enrollment_date, created_at, updated_at)
          VALUES (?, ?, ?, 'active', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `).bind(memberId, finalSchoolId, finalSchoolRole).run();
        
        // Add program associations if provided
        if (program_ids && Array.isArray(program_ids)) {
          for (const programId of program_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO membres_programs (membre_id, program_id, school_id, enrollment_date, status, role, created_at, updated_at)
              VALUES (?, ?, 1, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), 'active', 'student', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
            `).bind(memberId, programId).run();
          }
        }
        
        // Add class associations if provided
        if (class_ids && Array.isArray(class_ids)) {
          for (const classId of class_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO membres_classes (membre_id, class_id, school_id, enrollment_date, status, role, created_at, updated_at)
              VALUES (?, ?, 1, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), 'active', 'student', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
            `).bind(memberId, classId).run();
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Member created successfully',
          id: memberId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'PUT') {
        const data = await request.json();
        const { id, first_name, last_name, email, phone, password, school_id, school_role, program_ids, class_ids } = data;
        
        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Member ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Update basic member information
        let updateQuery = `
          UPDATE membres 
          SET first_name = ?, last_name = ?, email = ?, phone = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
        `;
        const updateParams = [first_name, last_name, email, phone];
        
        if (password && password.trim()) {
          // Hash the password if provided
          const crypto = await import('crypto');
          const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
          updateQuery += `, password_hash = ?`;
          updateParams.push(passwordHash);
        }
        
        updateQuery += ` WHERE id = ?`;
        updateParams.push(id);
        
        await this.env.AFFILIATE_DB.prepare(updateQuery).bind(...updateParams).run();
        
        // Update school association if provided
        if (school_id && school_role) {
          // Delete existing school associations
          await this.env.AFFILIATE_DB.prepare(`
            DELETE FROM membres_schools WHERE membre_id = ?
          `).bind(id).run();
          
          // Insert new school association
          await this.env.AFFILIATE_DB.prepare(`
            INSERT INTO membres_schools (membre_id, school_id, role, status, enrollment_date, created_at, updated_at)
            VALUES (?, ?, ?, 'active', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
          `).bind(id, school_id, school_role).run();
        }
        
        // Update program associations if provided
        if (program_ids && Array.isArray(program_ids)) {
          // Delete existing program associations
          await this.env.AFFILIATE_DB.prepare(`
            DELETE FROM membres_programs WHERE membre_id = ?
          `).bind(id).run();
          
          // Insert new program associations
          for (const programId of program_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO membres_programs (membre_id, program_id, school_id, enrollment_date, status, role, created_at, updated_at)
              VALUES (?, ?, 1, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), 'active', 'student', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
            `).bind(id, programId).run();
          }
        }
        
        // Update class associations if provided
        if (class_ids && Array.isArray(class_ids)) {
          // Delete existing class associations
          await this.env.AFFILIATE_DB.prepare(`
            DELETE FROM membres_classes WHERE membre_id = ?
          `).bind(id).run();
          
          // Insert new class associations
          for (const classId of class_ids) {
            await this.env.AFFILIATE_DB.prepare(`
              INSERT INTO membres_classes (membre_id, class_id, school_id, enrollment_date, status, role, created_at, updated_at)
              VALUES (?, ?, 1, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), 'active', 'student', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
            `).bind(id, classId).run();
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Member updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'DELETE') {
        const url = new URL(request.url);
        const memberId = url.searchParams.get('id');
        
        if (!memberId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Member ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Delete related records first
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM membres_school_fields WHERE membre_id = ?
        `).bind(memberId).run();
        
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM membres_schools WHERE membre_id = ?
        `).bind(memberId).run();
        
        // Delete the member
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM membres WHERE id = ?
        `).bind(memberId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Member deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Members API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion des définitions de champs par école
  async getSchoolFieldsApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer les définitions de champs
        const query = `
          SELECT 
            sfd.*,
            s.name as school_name
          FROM school_field_definitions sfd
          LEFT JOIN schools s ON sfd.school_id = s.id
          ORDER BY sfd.display_order, sfd.created_at DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          fields: result.results
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        const data = await request.json();
        const { school_id, field_name, field_label, field_type, is_required, display_order, is_active, field_options } = data;
        
        if (!school_id || !field_name || !field_label) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Missing required fields'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      
      const result = await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO school_field_definitions 
          (school_id, field_name, field_label, field_type, is_required, display_order, is_active, field_options, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `).bind(school_id, field_name, field_label, field_type, is_required ? 1 : 0, display_order || 0, is_active ? 1 : 0, field_options).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Field definition created successfully',
          id: result.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'PUT') {
        const data = await request.json();
        const { id, school_id, field_name, field_label, field_type, is_required, display_order, is_active, field_options } = data;
        
        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Field ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE school_field_definitions 
          SET school_id = ?, field_name = ?, field_label = ?, field_type = ?, is_required = ?, display_order = ?, is_active = ?, field_options = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `).bind(school_id, field_name, field_label, field_type, is_required ? 1 : 0, display_order || 0, is_active ? 1 : 0, field_options, id).run();
        
        return new Response(JSON.stringify({
        success: true,
          message: 'Field definition updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'DELETE') {
        const url = new URL(request.url);
        const fieldId = url.searchParams.get('id');
        
        if (!fieldId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Field ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM school_field_definitions WHERE id = ?
        `).bind(fieldId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Field definition deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ School Fields API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Écoles d'un membre
  async getMemberSchoolsApi(request, user) {
    try {
      const url = new URL(request.url);
      const membreId = url.searchParams.get('membre_id');
      
      if (!membreId) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Member ID is required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const query = `
        SELECT 
          ms.*,
          s.name as school_name,
          s.description as school_description
        FROM membres_schools ms
        LEFT JOIN schools s ON ms.school_id = s.id
        WHERE ms.membre_id = ?
        ORDER BY ms.enrollment_date DESC
      `;
      
      const result = await this.env.AFFILIATE_DB.prepare(query).bind(membreId).all();
      
      return new Response(JSON.stringify({
        success: true,
        schools: result.results
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Member Schools API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Classes Management
  async getClassesApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer la liste des classes avec statistiques
        // student_count: tous les membres dans la classe (actifs + inactifs)
        // active_members_count: seulement les membres actifs (status='active' dans membres_classes ET is_active=1 dans membres)
        // program: utilise le program_id de la classe directement
        const query = `
          SELECT 
            c.*,
            s.name as school_name,
            COUNT(DISTINCT mc.membre_id) as student_count,
            COUNT(DISTINCT CASE 
              WHEN mc.status = 'active' 
              AND mem.is_active = 1
              THEN mc.membre_id 
            END) as active_members_count,
            p.title as program_title,
            cr.member_id as representative_id,
            m.first_name as rep_first_name,
            m.last_name as rep_last_name,
            cr.role as rep_role,
            cr.status as rep_status
          FROM classes c
          LEFT JOIN schools s ON c.school_id = s.id
          LEFT JOIN programs p ON c.program_id = p.id
          LEFT JOIN membres_classes mc ON c.id = mc.class_id
          LEFT JOIN membres mem ON mc.membre_id = mem.id
          LEFT JOIN class_representatives cr ON c.id = cr.class_id AND cr.status = 'active'
          LEFT JOIN membres m ON cr.member_id = m.id
          GROUP BY c.id
          ORDER BY c.created_at DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          classes: result.results
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } else if (method === 'POST') {
        // Créer une nouvelle classe
        const data = await request.json();
        const { code, title, description, school_id, whatsapp_group_link } = data;
        
        if (!code || !title || !school_id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Code, title and school are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const insertQuery = `
          INSERT INTO classes (school_id, code, title, description, whatsapp_group_link, created_at)
          VALUES (?, ?, ?, ?, ?, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(insertQuery)
          .bind(school_id, code, title, description || '', whatsapp_group_link || '')
          .run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Class created successfully',
          class_id: result.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Classes API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Classe par ID
  async getClassByIdApi(request, user, classId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer une classe spécifique
        const query = `
          SELECT 
            c.*,
            s.name as school_name,
            COUNT(DISTINCT mc.membre_id) as student_count,
            cr.member_id as representative_id,
            m.first_name as rep_first_name,
            m.last_name as rep_last_name,
            cr.role as rep_role,
            cr.status as rep_status
          FROM classes c
          LEFT JOIN schools s ON c.school_id = s.id
          LEFT JOIN membres_classes mc ON c.id = mc.class_id
          LEFT JOIN class_representatives cr ON c.id = cr.class_id AND cr.status = 'active'
          LEFT JOIN membres m ON cr.member_id = m.id
          WHERE c.id = ?
          GROUP BY c.id
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(classId).first();
      
      if (!result) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Class not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: true,
          class: result
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } else if (method === 'PUT') {
        // Modifier une classe
        const data = await request.json();
        const { code, title, description, school_id, whatsapp_group_link } = data;
        
        if (!code || !title || !school_id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Code, title and school are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const updateQuery = `
          UPDATE classes 
          SET code = ?, title = ?, description = ?, school_id = ?, whatsapp_group_link = ?
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(updateQuery)
          .bind(code, title, description || '', school_id, whatsapp_group_link || '', classId)
          .run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Class updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } else if (method === 'DELETE') {
        // Supprimer une classe
        const deleteQuery = `DELETE FROM classes WHERE id = ?`;
        await this.env.AFFILIATE_DB.prepare(deleteQuery).bind(classId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Class deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Class by ID API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Représentants des classes
  async getClassRepresentativesApi(request, user) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer la liste des représentants
        const url = new URL(request.url);
        const classId = url.searchParams.get('class_id');
        
        let query = `
          SELECT 
            cr.*,
            c.title as class_title,
            c.code as class_code,
            m.first_name,
            m.last_name,
            m.email
          FROM class_representatives cr
          LEFT JOIN classes c ON cr.class_id = c.id
          LEFT JOIN membres m ON cr.member_id = m.id
        `;
        
        const params = [];
        if (classId) {
          query += ' WHERE cr.class_id = ?';
          params.push(classId);
        }
        
        query += ' ORDER BY cr.created_at DESC';
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(...params).all();
        
        return new Response(JSON.stringify({
          success: true,
          representatives: result.results
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } else if (method === 'POST') {
        // Assigner un représentant à une classe
        const data = await request.json();
        const { class_id, member_id, role = 'representative' } = data;
        
        if (!class_id || !member_id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Class ID and member ID are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Désactiver l'ancien représentant s'il existe
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE class_representatives 
          SET status = 'inactive', end_date = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE class_id = ? AND status = 'active'
        `).bind(class_id).run();
        
        // Assigner le nouveau représentant
        const insertQuery = `
          INSERT INTO class_representatives (class_id, member_id, role, status, start_date, created_at, updated_at)
          VALUES (?, ?, ?, 'active', STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(insertQuery)
          .bind(class_id, member_id, role)
          .run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Representative assigned successfully',
          representative_id: result.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Class Representatives API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Représentant par ID
  async getClassRepresentativeByIdApi(request, user, repId) {
    try {
      const method = request.method;
      
      if (method === 'PUT') {
        // Modifier un représentant
        const data = await request.json();
        const { role, status } = data;
        
        const updateQuery = `
          UPDATE class_representatives 
          SET role = ?, status = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(updateQuery)
          .bind(role, status, repId)
          .run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Representative updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } else if (method === 'DELETE') {
        // Désassigner un représentant
        const updateQuery = `
          UPDATE class_representatives 
          SET status = 'inactive', end_date = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(updateQuery).bind(repId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Representative unassigned successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Class Representative by ID API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ==================== SCHOOLS API ====================
  
  async getSchoolsApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer toutes les écoles avec statistiques (version simplifiée)
        const query = `
          SELECT 
            s.*,
            (SELECT COUNT(*) FROM user_schools us WHERE us.school_id = s.id AND us.role = 'admin') as admin_count,
            (SELECT COUNT(*) FROM membres_schools ms WHERE ms.school_id = s.id) as member_count,
            (SELECT COUNT(*) FROM classes c WHERE c.school_id = s.id) as class_count,
            (SELECT COUNT(*) FROM programs p WHERE p.school_id = s.id) as program_count
          FROM schools s
          ORDER BY s.created_at DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          schools: result.results
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        // Créer une nouvelle école
        const data = await request.json();
        
        const {
          name, slug, logo_url, description, website_url,
          facebook_pixel_id, google_analytics_id, google_tag_manager_id,
          contact_email, contact_phone, address, city, country, postal_code,
          timezone, currency, language, is_active
        } = data;
        
        const query = `
          INSERT INTO schools (
            name, slug, logo_url, description, website_url,
            facebook_pixel_id, google_analytics_id, google_tag_manager_id,
            contact_email, contact_phone, address, city, country, postal_code,
            timezone, currency, language, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(
          name, slug, logo_url, description, website_url,
          facebook_pixel_id, google_analytics_id, google_tag_manager_id,
          contact_email, contact_phone, address, city, country, postal_code,
          timezone, currency, language, is_active || 1
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'École créée avec succès',
          school_id: result.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Schools API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async getSchoolByIdApi(request, user, schoolId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer une école par ID
        const query = `
          SELECT 
            s.*,
            COUNT(DISTINCT us.user_id) as admin_count,
            COUNT(DISTINCT ms.membre_id) as member_count,
            COUNT(DISTINCT c.id) as class_count,
            COUNT(DISTINCT p.id) as program_count
          FROM schools s
          LEFT JOIN user_schools us ON s.id = us.school_id AND us.role = 'admin'
          LEFT JOIN membres_schools ms ON s.id = ms.school_id
          LEFT JOIN classes c ON s.id = c.school_id
          LEFT JOIN programs p ON s.id = p.school_id
          WHERE s.id = ?
          GROUP BY s.id
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(schoolId).first();
      
      if (!result) {
          return new Response(JSON.stringify({
            success: false,
            error: 'École non trouvée'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: true,
          school: result
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'PUT') {
        // Modifier une école
        const data = await request.json();
        
        const {
          name, slug, logo_url, description, website_url,
          facebook_pixel_id, google_analytics_id, google_tag_manager_id,
          contact_email, contact_phone, address, city, country, postal_code,
          timezone, currency, language, is_active
        } = data;
        
        // Gérer les valeurs null/undefined
        const safeValue = (val) => val === null || val === undefined ? null : val;
        
        const query = `
          UPDATE schools SET 
            name = ?, slug = ?, logo_url = ?, description = ?, website_url = ?,
            facebook_pixel_id = ?, google_analytics_id = ?, google_tag_manager_id = ?,
            contact_email = ?, contact_phone = ?, address = ?, city = ?, country = ?, postal_code = ?,
            timezone = ?, currency = ?, language = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(
          safeValue(name), safeValue(slug), safeValue(logo_url), safeValue(description), safeValue(website_url),
          safeValue(facebook_pixel_id), safeValue(google_analytics_id), safeValue(google_tag_manager_id),
          safeValue(contact_email), safeValue(contact_phone), safeValue(address), safeValue(city), safeValue(country), safeValue(postal_code),
          safeValue(timezone), safeValue(currency), safeValue(language), safeValue(is_active), schoolId
        ).run();
        
        console.log('Update result:', result);
        
        return new Response(JSON.stringify({
          success: true,
          message: 'École modifiée avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'DELETE') {
        // Supprimer une école
        const query = `DELETE FROM schools WHERE id = ?`;
        await this.env.AFFILIATE_DB.prepare(query).bind(schoolId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'École supprimée avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ School by ID API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async getSchoolAdminsApi(request, user, schoolId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer les administrateurs d'une école
        const query = `
          SELECT 
            u.id, u.username, u.email, u.first_name, u.last_name, u.phone,
            u.is_active, u.created_at, u.last_login,
            us.role, us.status, us.enrollment_date
          FROM users u
          JOIN user_schools us ON u.id = us.user_id
          WHERE us.school_id = ? AND us.role = 'admin'
          ORDER BY us.enrollment_date DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(schoolId).all();
        
        return new Response(JSON.stringify({
          success: true,
          admins: result.results
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        // Assigner un administrateur à une école
        const data = await request.json();
        const { user_id, role = 'admin', status = 'active' } = data;
        
        const query = `
          INSERT OR REPLACE INTO user_schools (user_id, school_id, role, status, enrollment_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        await this.env.AFFILIATE_DB.prepare(query).bind(user_id, schoolId, role, status).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Administrateur assigné avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ School Admins API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ===== QUIZZES API =====

  // API: Gestion des quiz
  async getQuizzesApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer tous les quiz avec statistiques
        const query = `
          SELECT 
            q.*,
            s.name as school_name,
            p.title as program_name,
            COUNT(DISTINCT qa.id) as total_attempts,
            COUNT(DISTINCT CASE WHEN qa.status = 'completed' THEN qa.id END) as completed_attempts,
            AVG(CASE WHEN qa.status = 'completed' THEN qa.score END) as average_score
          FROM quizzes q
          LEFT JOIN schools s ON q.school_id = s.id
          LEFT JOIN programs p ON q.program_id = p.id
          LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
          GROUP BY q.id
          ORDER BY q.created_at DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          quizzes: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        // Créer un nouveau quiz
        const data = await request.json();
        
        const {
          school_id, program_id, title, description, instructions,
          time_limit_days, max_attempts, language, is_active
        } = data;
        
        const query = `
          INSERT INTO quizzes (
            school_id, program_id, title, description, instructions,
            time_limit_days, max_attempts, language, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(
          school_id, program_id, title, description, instructions,
          time_limit_days || 14, max_attempts || 5, language || 'fr', is_active || 1
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Quiz créé avec succès',
          quiz_id: result.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quizzes API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'un quiz spécifique
  async getQuizByIdApi(request, user, quizId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer un quiz avec ses questions
        const quizQuery = `
          SELECT q.*, s.name as school_name, p.title as program_name
          FROM quizzes q
          LEFT JOIN schools s ON q.school_id = s.id
          LEFT JOIN programs p ON q.program_id = p.id
          WHERE q.id = ?
        `;
        
        const quiz = await this.env.AFFILIATE_DB.prepare(quizQuery).bind(quizId).first();
        
        if (!quiz) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Quiz non trouvé'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Récupérer les questions du quiz
        const questionsQuery = `
          SELECT qq.*, 
                 GROUP_CONCAT(qqo.id || '|' || qqo.option_text || '|' || qqo.is_correct || '|' || qqo.order_index, '||') as options
          FROM quiz_questions qq
          LEFT JOIN quiz_question_options qqo ON qq.id = qqo.question_id
          WHERE qq.quiz_id = ?
          GROUP BY qq.id
          ORDER BY qq.order_index
        `;
        
        const questions = await this.env.AFFILIATE_DB.prepare(questionsQuery).bind(quizId).all();
        
        return new Response(JSON.stringify({
          success: true,
          quiz: quiz,
          questions: questions.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'PUT') {
        // Modifier un quiz
        const data = await request.json();
        
        const {
          school_id, program_id, title, description, instructions,
          time_limit_days, max_attempts, language, is_active
        } = data;
        
        const query = `
          UPDATE quizzes SET 
            school_id = ?, program_id = ?, title = ?, description = ?, instructions = ?,
            time_limit_days = ?, max_attempts = ?, language = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(query).bind(
          school_id, program_id, title, description, instructions,
          time_limit_days, max_attempts, language, is_active, quizId
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Quiz modifié avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'DELETE') {
        // Supprimer un quiz
        const query = `DELETE FROM quizzes WHERE id = ?`;
        await this.env.AFFILIATE_DB.prepare(query).bind(quizId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Quiz supprimé avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz by ID API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Participants d'un quiz
  async getQuizParticipantsApi(request, user, quizId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer les participants d'un quiz
        const query = `
          SELECT 
            qa.id as attempt_id,
            qa.membre_id,
            m.first_name,
            m.last_name,
            m.email,
            qa.started_at,
            qa.completed_at,
            qa.score,
            qa.total_points,
            qa.status,
            COUNT(qans.id) as total_answers,
            COUNT(CASE WHEN qans.is_correct = 1 THEN qans.id END) as correct_answers
          FROM quiz_attempts qa
          LEFT JOIN membres m ON qa.membre_id = m.id
          LEFT JOIN quiz_answers qans ON qa.id = qans.attempt_id
          WHERE qa.quiz_id = ?
          GROUP BY qa.id
          ORDER BY qa.started_at DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(quizId).all();
        
        return new Response(JSON.stringify({
          success: true,
          participants: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Participants API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion des questions d'un quiz
  async getQuizQuestionsApi(request, user, quizId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer toutes les questions d'un quiz
        const query = `
          SELECT qq.*, 
                 GROUP_CONCAT(qqo.id || '|' || qqo.option_text || '|' || qqo.is_correct || '|' || qqo.order_index, '||') as options
          FROM quiz_questions qq
          LEFT JOIN quiz_question_options qqo ON qq.id = qqo.question_id
          WHERE qq.quiz_id = ?
          GROUP BY qq.id
          ORDER BY qq.order_index
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(quizId).all();
        
        return new Response(JSON.stringify({
          success: true,
          questions: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        // Créer une nouvelle question
        const data = await request.json();
        
        const {
          question_text, question_type, order_index, is_required, points, placeholder
        } = data;
        
        const query = `
          INSERT INTO quiz_questions (
            quiz_id, question_text, question_type, order_index, is_required, points, placeholder, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(
          quizId, question_text, question_type, order_index || 0, is_required || 1, points || 1, placeholder
        ).run();
        
        const questionId = result.meta.last_row_id;
        
        // Si c'est une question à choix, ajouter les options
        if (data.options && (question_type === 'radio' || question_type === 'checkbox' || question_type === 'select')) {
          for (const option of data.options) {
            const optionQuery = `
              INSERT INTO quiz_question_options (question_id, option_text, is_correct, order_index)
              VALUES (?, ?, ?, ?)
            `;
            await this.env.AFFILIATE_DB.prepare(optionQuery).bind(
              questionId, option.text, option.is_correct || 0, option.order || 0
            ).run();
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Question créée avec succès',
          question_id: questionId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Questions API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'une question spécifique
  async getQuizQuestionByIdApi(request, user, questionId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer une question avec ses options
        const questionQuery = `
          SELECT * FROM quiz_questions WHERE id = ?
        `;
        
        const question = await this.env.AFFILIATE_DB.prepare(questionQuery).bind(questionId).first();
        
        if (!question) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Question non trouvée'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Récupérer les options de la question
        const optionsQuery = `
          SELECT * FROM quiz_question_options WHERE question_id = ? ORDER BY order_index
        `;
        
        const options = await this.env.AFFILIATE_DB.prepare(optionsQuery).bind(questionId).all();
        
        return new Response(JSON.stringify({
          success: true,
          question: question,
          options: options.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'PUT') {
        // Modifier une question
        const data = await request.json();
        
        const {
          question_text, question_type, order_index, is_required, points, placeholder
        } = data;
        
        const query = `
          UPDATE quiz_questions SET 
            question_text = ?, question_type = ?, order_index = ?, is_required = ?, points = ?, placeholder = ?
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(query).bind(
          question_text, question_type, order_index, is_required, points, placeholder, questionId
        ).run();
        
        // Supprimer les anciennes options et ajouter les nouvelles
        if (data.options && (question_type === 'radio' || question_type === 'checkbox' || question_type === 'select')) {
          // Supprimer les anciennes options
          await this.env.AFFILIATE_DB.prepare('DELETE FROM quiz_question_options WHERE question_id = ?').bind(questionId).run();
          
          // Ajouter les nouvelles options
          for (const option of data.options) {
            const optionQuery = `
              INSERT INTO quiz_question_options (question_id, option_text, is_correct, order_index)
              VALUES (?, ?, ?, ?)
            `;
            await this.env.AFFILIATE_DB.prepare(optionQuery).bind(
              questionId, option.text, option.is_correct || 0, option.order || 0
            ).run();
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Question modifiée avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'DELETE') {
        // Supprimer une question
        const query = `DELETE FROM quiz_questions WHERE id = ?`;
        await this.env.AFFILIATE_DB.prepare(query).bind(questionId).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Question supprimée avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Question by ID API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Commencer une tentative de quiz
  async getQuizAttemptApi(request, user, quizId) {
    try {
      const method = request.method;
      
      if (method === 'POST') {
        // Commencer une nouvelle tentative
        const data = await request.json();
        const { membre_id } = data;
        
        // Vérifier si le membre existe
        const memberQuery = `SELECT * FROM membres WHERE id = ?`;
        const member = await this.env.AFFILIATE_DB.prepare(memberQuery).bind(membre_id).first();
        
        if (!member) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Membre non trouvé'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Vérifier le quiz
        const quizQuery = `SELECT * FROM quizzes WHERE id = ? AND is_active = 1`;
        const quiz = await this.env.AFFILIATE_DB.prepare(quizQuery).bind(quizId).first();
        
        if (!quiz) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Quiz non trouvé ou inactif'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Vérifier le nombre de tentatives existantes
        const attemptsQuery = `
          SELECT COUNT(*) as count FROM quiz_attempts 
          WHERE quiz_id = ? AND membre_id = ?
        `;
        const attemptsResult = await this.env.AFFILIATE_DB.prepare(attemptsQuery).bind(quizId, membre_id).first();
        
        if (attemptsResult.count >= quiz.max_attempts) {
          return new Response(JSON.stringify({
            success: false,
            error: `Nombre maximum de tentatives atteint (${quiz.max_attempts})`
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Vérifier s'il y a une tentative en cours
        const inProgressQuery = `
          SELECT * FROM quiz_attempts 
          WHERE quiz_id = ? AND membre_id = ? AND status = 'in_progress'
        `;
        const inProgressAttempt = await this.env.AFFILIATE_DB.prepare(inProgressQuery).bind(quizId, membre_id).first();
        
        if (inProgressAttempt) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Une tentative est déjà en cours'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Créer la nouvelle tentative
        const insertQuery = `
          INSERT INTO quiz_attempts (quiz_id, membre_id, started_at, status)
          VALUES (?, ?, CURRENT_TIMESTAMP, 'in_progress')
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(insertQuery).bind(quizId, membre_id).run();
        const attemptId = result.meta.last_row_id;
        
        // Récupérer les questions du quiz
        const questionsQuery = `
          SELECT qq.*, 
                 GROUP_CONCAT(qqo.id || '|' || qqo.option_text || '|' || qqo.is_correct || '|' || qqo.order_index, '||') as options
          FROM quiz_questions qq
          LEFT JOIN quiz_question_options qqo ON qq.id = qqo.question_id
          WHERE qq.quiz_id = ?
          GROUP BY qq.id
          ORDER BY qq.order_index
        `;
        
        const questions = await this.env.AFFILIATE_DB.prepare(questionsQuery).bind(quizId).all();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Tentative commencée avec succès',
          attempt_id: attemptId,
          quiz: {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            time_limit_days: quiz.time_limit_days,
            max_attempts: quiz.max_attempts
          },
          questions: questions.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Attempt API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'une tentative spécifique
  async getQuizAttemptByIdApi(request, user, attemptId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer les détails d'une tentative
        const attemptQuery = `
          SELECT qa.*, q.title as quiz_title, m.first_name, m.last_name, m.email
          FROM quiz_attempts qa
          LEFT JOIN quizzes q ON qa.quiz_id = q.id
          LEFT JOIN membres m ON qa.membre_id = m.id
          WHERE qa.id = ?
        `;
        
        const attempt = await this.env.AFFILIATE_DB.prepare(attemptQuery).bind(attemptId).first();
        
        if (!attempt) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Tentative non trouvée'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Récupérer les réponses de la tentative
        const answersQuery = `
          SELECT qa.*, qq.question_text, qq.question_type, qq.points
          FROM quiz_answers qa
          LEFT JOIN quiz_questions qq ON qa.question_id = qq.id
          WHERE qa.attempt_id = ?
          ORDER BY qq.order_index
        `;
        
        const answers = await this.env.AFFILIATE_DB.prepare(answersQuery).bind(attemptId).all();
        
        return new Response(JSON.stringify({
          success: true,
          attempt: attempt,
          answers: answers.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'PUT') {
        // Soumettre une tentative
        const data = await request.json();
        const { answers } = data;
        
        // Vérifier que la tentative existe et est en cours
        const attemptQuery = `SELECT * FROM quiz_attempts WHERE id = ? AND status = 'in_progress'`;
        const attempt = await this.env.AFFILIATE_DB.prepare(attemptQuery).bind(attemptId).first();
        
        if (!attempt) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Tentative non trouvée ou déjà terminée'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Vérifier la limite de temps
        const timeLimitQuery = `
          SELECT time_limit_days FROM quizzes WHERE id = ?
        `;
        const quiz = await this.env.AFFILIATE_DB.prepare(timeLimitQuery).bind(attempt.quiz_id).first();
        
        if (quiz.time_limit_days) {
          const startTime = new Date(attempt.started_at);
          const now = new Date();
          const daysDiff = (now - startTime) / (1000 * 60 * 60 * 24);
          
          if (daysDiff > quiz.time_limit_days) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Temps limite dépassé'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        
        let totalScore = 0;
        let totalPoints = 0;
        
        // Traiter chaque réponse
        for (const answer of answers) {
          const { question_id, answer_text, answer_number } = answer;
          
          // Récupérer la question pour calculer les points
          const questionQuery = `SELECT * FROM quiz_questions WHERE id = ?`;
          const question = await this.env.AFFILIATE_DB.prepare(questionQuery).bind(question_id).first();
          
          if (!question) continue;
          
          totalPoints += question.points;
          
          let isCorrect = null;
          let pointsEarned = 0;
          
          // Calculer la correction selon le type de question
          if (question.question_type === 'radio' || question.question_type === 'select') {
            // Vérifier la réponse correcte
            const correctOptionQuery = `
              SELECT * FROM quiz_question_options 
              WHERE question_id = ? AND is_correct = 1
            `;
            const correctOption = await this.env.AFFILIATE_DB.prepare(correctOptionQuery).bind(question_id).first();
            
            if (correctOption && answer_text === correctOption.option_text) {
              isCorrect = 1;
              pointsEarned = question.points;
              totalScore += question.points;
            } else {
              isCorrect = 0;
            }
          } else if (question.question_type === 'checkbox') {
            // Pour les checkboxes, on compare les réponses multiples
            const correctOptionsQuery = `
              SELECT * FROM quiz_question_options 
              WHERE question_id = ? AND is_correct = 1
              ORDER BY order_index
            `;
            const correctOptions = await this.env.AFFILIATE_DB.prepare(correctOptionsQuery).bind(question_id).all();
            
            // Logique simplifiée pour les checkboxes
            if (answer_text && answer_text.length > 0) {
              isCorrect = 1; // À corriger manuellement
              pointsEarned = question.points;
              totalScore += question.points;
            } else {
              isCorrect = 0;
            }
          } else {
            // Questions ouvertes (text, textarea, number) - correction manuelle
            isCorrect = null;
            pointsEarned = 0;
          }
          
          // Insérer la réponse
          const answerQuery = `
            INSERT INTO quiz_answers (attempt_id, question_id, answer_text, answer_number, is_correct, points_earned)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          await this.env.AFFILIATE_DB.prepare(answerQuery).bind(
            attemptId, question_id, answer_text, answer_number, isCorrect, pointsEarned
          ).run();
        }
        
        // Mettre à jour la tentative
        const updateAttemptQuery = `
          UPDATE quiz_attempts SET 
            completed_at = CURRENT_TIMESTAMP,
            score = ?,
            total_points = ?,
            status = 'completed'
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(updateAttemptQuery).bind(
          totalScore, totalPoints, attemptId
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Tentative soumise avec succès',
          score: totalScore,
          total_points: totalPoints,
          percentage: totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Attempt by ID API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Résultats d'une tentative
  async getQuizAttemptResultsApi(request, user, attemptId) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer les résultats détaillés d'une tentative
        const attemptQuery = `
          SELECT qa.*, q.title as quiz_title, q.description, q.instructions,
                 m.first_name, m.last_name, m.email
          FROM quiz_attempts qa
          LEFT JOIN quizzes q ON qa.quiz_id = q.id
          LEFT JOIN membres m ON qa.membre_id = m.id
          WHERE qa.id = ?
        `;
        
        const attempt = await this.env.AFFILIATE_DB.prepare(attemptQuery).bind(attemptId).first();
        
        if (!attempt) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Tentative non trouvée'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Récupérer les réponses avec les questions
        const answersQuery = `
          SELECT qa.*, qq.question_text, qq.question_type, qq.points, qq.placeholder
          FROM quiz_answers qa
          LEFT JOIN quiz_questions qq ON qa.question_id = qq.id
          WHERE qa.attempt_id = ?
          ORDER BY qq.order_index
        `;
        
        const answers = await this.env.AFFILIATE_DB.prepare(answersQuery).bind(attemptId).all();
        
        // Pour chaque réponse, récupérer les options correctes si applicable
        const detailedAnswers = [];
        for (const answer of answers.results) {
          let correctOptions = [];
          
          if (answer.question_type === 'radio' || answer.question_type === 'select' || answer.question_type === 'checkbox') {
            const optionsQuery = `
              SELECT * FROM quiz_question_options 
              WHERE question_id = ? 
              ORDER BY order_index
            `;
            const options = await this.env.AFFILIATE_DB.prepare(optionsQuery).bind(answer.question_id).all();
            correctOptions = options.results || [];
          }
          
          detailedAnswers.push({
            ...answer,
            correct_options: correctOptions
          });
        }
        
        // Calculer le total des points possibles
        const totalPointsQuery = `
          SELECT SUM(points) as total_possible 
          FROM quiz_questions 
          WHERE quiz_id = ?
        `;
        const totalPointsResult = await this.env.AFFILIATE_DB.prepare(totalPointsQuery).bind(attempt.quiz_id).first();
        const totalPoints = totalPointsResult.total_possible || 0;
        
        return new Response(JSON.stringify({
          success: true,
          attempt: attempt,
          answers: detailedAnswers,
          summary: {
            total_questions: answers.results.length,
            correct_answers: answers.results.filter(a => a.is_correct === 1).length,
            score: attempt.score,
            total_points: totalPoints,
            percentage: totalPoints > 0 ? Math.round((attempt.score / totalPoints) * 100) : 0
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Attempt Results API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Correction manuelle d'une réponse
  async getQuizAnswerCorrectionApi(request, user, answerId) {
    try {
      const method = request.method;
      
      if (method === 'POST') {
        // Sauvegarder la correction manuelle
        const data = await request.json();
        const { points_awarded, feedback } = data;
        
        // Vérifier que la réponse existe
        const answerQuery = `
          SELECT qa.*, qq.points as max_points 
          FROM quiz_answers qa
          LEFT JOIN quiz_questions qq ON qa.question_id = qq.id
          WHERE qa.id = ?
        `;
        const answer = await this.env.AFFILIATE_DB.prepare(answerQuery).bind(answerId).first();
        
        if (!answer) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Réponse non trouvée'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Valider les points attribués
        if (points_awarded < 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Le nombre de points ne peut pas être négatif'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (points_awarded > answer.max_points) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Le nombre de points ne peut pas dépasser ' + answer.max_points
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Mettre à jour la réponse avec les points attribués
        const updateAnswerQuery = `
          UPDATE quiz_answers SET 
            points_earned = ?,
            is_correct = ?
          WHERE id = ?
        `;
        
        const isCorrect = points_awarded > 0 ? 1 : 0;
        await this.env.AFFILIATE_DB.prepare(updateAnswerQuery).bind(
          points_awarded, isCorrect, answerId
        ).run();
        
        // Insérer ou mettre à jour la correction manuelle
        const correctionQuery = `
          INSERT OR REPLACE INTO quiz_manual_corrections 
          (answer_id, corrector_id, points_awarded, feedback, corrected_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        await this.env.AFFILIATE_DB.prepare(correctionQuery).bind(
          answerId, user.id, points_awarded, feedback || null
        ).run();
        
        // Recalculer le score total de la tentative
        const attemptScoreQuery = `
          SELECT SUM(points_earned) as total_score, 
                 (SELECT SUM(points) FROM quiz_questions WHERE quiz_id = (SELECT quiz_id FROM quiz_attempts WHERE id = ?)) as total_points
          FROM quiz_answers 
          WHERE attempt_id = ?
        `;
        
        const scoreResult = await this.env.AFFILIATE_DB.prepare(attemptScoreQuery).bind(
          answer.attempt_id, answer.attempt_id
        ).first();
        
        // Mettre à jour le score de la tentative
        const updateAttemptQuery = `
          UPDATE quiz_attempts SET 
            score = ?,
            total_points = ?
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(updateAttemptQuery).bind(
          scoreResult.total_score || 0, 
          scoreResult.total_points || 0, 
          answer.attempt_id
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Correction sauvegardée avec succès',
          new_score: scoreResult.total_score || 0,
          total_points: scoreResult.total_points || 0,
          percentage: scoreResult.total_points > 0 ? 
            Math.round(((scoreResult.total_score || 0) / scoreResult.total_points) * 100) : 0
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('❌ Quiz Answer Correction API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ===== COURSES API =====
  async getCoursesApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer tous les cours avec leurs relations
        const query = `
          SELECT 
            c.*,
            s.name as school_name,
            GROUP_CONCAT(DISTINCT p.title) as programs,
            GROUP_CONCAT(DISTINCT CONCAT(sp.first_name, ' ', sp.last_name)) as speakers,
            GROUP_CONCAT(DISTINCT t.name) as tags,
            GROUP_CONCAT(DISTINCT m.title) as modules
          FROM courses c
          LEFT JOIN schools s ON c.school_id = s.id
          LEFT JOIN course_programs cp ON c.id = cp.course_id
          LEFT JOIN programs p ON cp.program_id = p.id
          LEFT JOIN course_speakers cs ON c.id = cs.course_id
          LEFT JOIN speakers sp ON cs.speaker_id = sp.id
          LEFT JOIN tag_relations tr ON c.id = tr.entity_id AND tr.entity_type = 'course'
          LEFT JOIN tags t ON tr.tag_id = t.id
          LEFT JOIN course_modules cm ON c.id = cm.course_id
          LEFT JOIN modules m ON cm.module_id = m.id
          GROUP BY c.id
          ORDER BY c.created_at DESC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          courses: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST') {
        // Créer un nouveau cours
        const data = await request.json();
        
        const {
          school_id, title, description, content, thumbnail_url,
          status, difficulty_level, estimated_duration, language, is_featured
        } = data;
        
        const query = `
          INSERT INTO courses (
            school_id, title, description, content, thumbnail_url,
            status, difficulty_level, estimated_duration, language, is_featured,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).bind(
          school_id, title, description || null, content || null, thumbnail_url || null,
          status || 'draft', difficulty_level || 'beginner', estimated_duration || 0, language || 'fr', is_featured || false
        ).run();
        
        return new Response(JSON.stringify({
          success: true,
          course_id: result.meta.last_row_id
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
      console.error('Error in getCoursesApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ===== MODULES API =====
  async getModulesApi(request, user) {
    try {
      const method = request.method;

      if (method === 'GET') {
        // Récupérer la liste des modules avec leurs relations
        const query = `
          SELECT 
            m.id,
            m.school_id,
            m.title,
            m.description,
            m.content,
            m.order_index,
            m.status,
            m.created_at,
            m.updated_at,
            s.name as school_name,
            GROUP_CONCAT(DISTINCT p.title) as programs,
            GROUP_CONCAT(DISTINCT sp.first_name || ' ' || sp.last_name) as speakers,
            GROUP_CONCAT(DISTINCT t.name) as tags
          FROM modules m
          LEFT JOIN schools s ON m.school_id = s.id
          LEFT JOIN module_programs mp ON m.id = mp.module_id
          LEFT JOIN programs p ON mp.program_id = p.id
          LEFT JOIN module_speakers ms ON m.id = ms.module_id
          LEFT JOIN speakers sp ON ms.speaker_id = sp.id
          LEFT JOIN tag_relations tr ON m.id = tr.entity_id AND tr.entity_type = 'module'
          LEFT JOIN tags t ON tr.tag_id = t.id
          GROUP BY m.id
          ORDER BY m.order_index ASC, m.created_at DESC
        `;

        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          modules: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } else if (method === 'POST') {
        // Créer un nouveau module
        const body = await request.json();
        const { school_id, title, description, content, order_index, status, programs, speakers } = body;

        if (!school_id || !title) {
          return new Response(JSON.stringify({
            success: false,
            error: 'school_id and title are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Insérer le module
        const insertModule = `
          INSERT INTO modules (school_id, title, description, content, order_index, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        const moduleResult = await this.env.AFFILIATE_DB.prepare(insertModule).bind(
          school_id,
          title,
          description || null,
          content || null,
          order_index || 0,
          status || 'draft'
        ).run();

        const moduleId = moduleResult.meta.last_row_id;

        // Associer les programmes
        if (programs && programs.length > 0) {
          for (const programId of programs) {
            if (programId) {
              await this.env.AFFILIATE_DB.prepare(`
                INSERT INTO module_programs (module_id, program_id)
                VALUES (?, ?)
              `).bind(moduleId, programId).run();
            }
          }
        }

        // Associer les intervenants
        if (speakers && speakers.length > 0) {
          for (const speakerId of speakers) {
            if (speakerId) {
              await this.env.AFFILIATE_DB.prepare(`
                INSERT INTO module_speakers (module_id, speaker_id)
                VALUES (?, ?)
              `).bind(moduleId, speakerId).run();
            }
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Module créé avec succès',
          module_id: moduleId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } else {
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('Error in getModulesApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // ===== COURSE BY ID API =====
  async getCourseByIdApi(request, user, courseId, env) {
    try {
      console.log('🔍 getCourseByIdApi called with courseId:', courseId);
      console.log('🔍 env:', env);
      console.log('🔍 env.DB:', env?.DB);
      
      const method = request.method;

      if (method === 'GET') {
        try {
          // Récupérer les informations de base du cours
          const courseQuery = `
            SELECT 
              c.id,
              c.school_id,
              c.title,
              c.description,
              c.content,
              c.thumbnail_url,
              c.status,
              c.difficulty_level,
              c.estimated_duration,
              c.language,
              c.is_featured,
              c.created_at,
              c.updated_at,
              s.name as school_name
            FROM courses c
            LEFT JOIN schools s ON c.school_id = s.id
            WHERE c.id = ?
          `;

          const course = await env.DB.prepare(courseQuery).bind(courseId).first();
          
          if (!course) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Course not found'
            }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Ajouter des valeurs par défaut pour les relations
          course.programs = '';
          course.speakers = '';
          course.tags = '';
          course.modules = '';
          course.video_count = 0;
          
          return new Response(JSON.stringify({
            success: true,
            course: course
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error in getCourseByIdApi GET:', error);
          return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error: ' + error.message
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      } else if (method === 'DELETE') {
        // Supprimer un cours et toutes ses relations
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM course_programs WHERE course_id = ?
        `).bind(courseId).run();

        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM course_speakers WHERE course_id = ?
        `).bind(courseId).run();

        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM course_videos WHERE course_id = ?
        `).bind(courseId).run();

        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM course_modules WHERE course_id = ?
        `).bind(courseId).run();

        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM tag_relations WHERE entity_type = 'course' AND entity_id = ?
        `).bind(courseId).run();

        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM courses WHERE id = ?
        `).bind(courseId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Course deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } else {
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
    } catch (error) {
      console.error('Error in getCourseByIdApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async getTagsApi(request, user) {
    try {
      const method = request.method;
      
      if (method === 'GET') {
        // Récupérer tous les tags
        const query = `
          SELECT * FROM tags
          ORDER BY name ASC
        `;
        
        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        
        return new Response(JSON.stringify({
          success: true,
          tags: result.results || []
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
      console.error('Error in getTagsApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion des réclamations
  async getReclamationsApi(request, user) {
    try {
      const method = request.method;
      const url = new URL(request.url);
      
      if (method === 'GET') {
        // Récupérer les paramètres de filtrage
        const status = url.searchParams.get('status') || null;
        const programId = url.searchParams.get('program_id') || null;
        
        // Construire la requête SQL avec informations du membre
        let query = `
          SELECT 
            r.*,
            p.title as program_title,
            m.id as membre_id,
            GROUP_CONCAT(DISTINCT prog.title) as membre_programs,
            GROUP_CONCAT(DISTINCT c.code) as membre_classes
          FROM reclamations r
          LEFT JOIN programs p ON r.program_id = p.id
          LEFT JOIN membres m ON r.email = m.email
          LEFT JOIN membres_programs mp ON m.id = mp.membre_id AND mp.status = 'active'
          LEFT JOIN programs prog ON mp.program_id = prog.id
          LEFT JOIN membres_classes mc ON m.id = mc.membre_id AND mc.status = 'active'
          LEFT JOIN classes c ON mc.class_id = c.id
          WHERE 1=1
        `;
        
        const params = [];
        
        if (status) {
          query += ` AND r.status = ?`;
          params.push(status);
        }
        
        if (programId) {
          query += ` AND r.program_id = ?`;
          params.push(programId);
        }
        
        query += ` GROUP BY r.id ORDER BY r.created_at DESC`;
        
        const stmt = params.length > 0 
          ? this.env.AFFILIATE_DB.prepare(query).bind(...params)
          : this.env.AFFILIATE_DB.prepare(query);
        
        const result = await stmt.all();
        
        return new Response(JSON.stringify({
          success: true,
          reclamations: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (method === 'PUT') {
        // Mettre à jour le statut d'une réclamation
        const data = await request.json();
        const { id, status, note } = data;
        
        if (!id || !status) {
          return new Response(JSON.stringify({
            success: false,
            error: 'ID and status are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const updateQuery = `
          UPDATE reclamations 
          SET status = ?, 
              note = ?,
              updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `;
        
        await this.env.AFFILIATE_DB.prepare(updateQuery)
          .bind(status, note || null, id)
          .run();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Réclamation mise à jour avec succès'
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
      console.error('Error in getReclamationsApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Dashboard - Statistiques
  async getDashboardApi(request, user) {
    try {
      const method = request.method;

      if (method === 'GET') {
        // Statistiques par programme : nombre de membres et membres actifs
        const query = `
          SELECT 
            p.id,
            p.title as program_name,
            COUNT(DISTINCT mp.membre_id) as total_members,
            COUNT(DISTINCT CASE 
              WHEN m.is_active = 1 
              AND m.last_login IS NOT NULL 
              AND datetime(m.last_login) >= datetime('now', '-15 days')
              THEN m.id
            END) as active_members
          FROM programs p
          LEFT JOIN membres_programs mp ON p.id = mp.program_id AND mp.status = 'active'
          LEFT JOIN membres m ON mp.membre_id = m.id
          GROUP BY p.id, p.title
          ORDER BY total_members DESC
        `;

        const result = await this.env.AFFILIATE_DB.prepare(query).all();

        // Statistiques globales
        const globalStatsQuery = `
          SELECT 
            COUNT(DISTINCT m.id) as total_members_all,
            COUNT(DISTINCT CASE 
              WHEN m.is_active = 1 
              AND m.last_login IS NOT NULL 
              AND datetime(m.last_login) >= datetime('now', '-15 days')
              THEN m.id
            END) as total_active_members_all,
            COUNT(DISTINCT p.id) as total_programs
          FROM membres m
          LEFT JOIN membres_programs mp ON m.id = mp.membre_id AND mp.status = 'active'
          LEFT JOIN programs p ON mp.program_id = p.id
        `;

        const globalStats = await this.env.AFFILIATE_DB.prepare(globalStatsQuery).first();

        return new Response(JSON.stringify({
          success: true,
          stats: {
            byProgram: result.results || [],
            global: globalStats || {}
          }
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
      console.error('Error in getDashboardApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: TAFs (Travaux à Faire)
  async getTafsApi(request, user) {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(p => p);
      const tafId = pathParts.length > 2 ? parseInt(pathParts[2]) : null;

      if (method === 'GET') {
        // Créer la table de liaison si elle n'existe pas
        await this.env.AFFILIATE_DB.prepare(`
          CREATE TABLE IF NOT EXISTS taf_programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            taf_id INTEGER NOT NULL,
            program_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(taf_id, program_id),
            FOREIGN KEY (taf_id) REFERENCES tafs(id) ON DELETE CASCADE,
            FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
          )
        `).run();

        if (tafId) {
          // Récupérer un TAF spécifique avec ses programmes
          const query = `
            SELECT 
              t.*,
              s.name as school_name
            FROM tafs t
            LEFT JOIN schools s ON t.school_id = s.id
            WHERE t.id = ?
          `;

          const result = await this.env.AFFILIATE_DB.prepare(query).bind(tafId).first();

          if (!result) {
            return new Response(JSON.stringify({
              success: false,
              error: 'TAF not found'
            }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Récupérer les programmes associés
          const programsQuery = `
            SELECT 
              tp.program_id,
              p.title as program_name
            FROM taf_programs tp
            LEFT JOIN programs p ON tp.program_id = p.id
            WHERE tp.taf_id = ?
          `;
          const programsResult = await this.env.AFFILIATE_DB.prepare(programsQuery).bind(tafId).all();
          
          result.program_ids = (programsResult.results || []).map(p => p.program_id);
          result.programs = programsResult.results || [];
          
          // Rétrocompatibilité : si aucun programme dans taf_programs, utiliser program_id
          if (result.program_ids.length === 0 && result.program_id) {
            result.program_ids = [result.program_id];
            const programQuery = await this.env.AFFILIATE_DB.prepare('SELECT id, title FROM programs WHERE id = ?').bind(result.program_id).first();
            if (programQuery) {
              result.programs = [{ program_id: programQuery.id, program_name: programQuery.title }];
            }
          }

          // Parser le contenu JSON
          try {
            result.content = JSON.parse(result.content);
          } catch (e) {
            result.content = {};
          }

          return new Response(JSON.stringify({
            success: true,
            taf: result
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          // Récupérer tous les TAFs avec leurs programmes
          const query = `
            SELECT 
              t.*,
              s.name as school_name
            FROM tafs t
            LEFT JOIN schools s ON t.school_id = s.id
            ORDER BY t.start_date DESC, t.created_at DESC
          `;

          const result = await this.env.AFFILIATE_DB.prepare(query).all();
          const tafs = result.results || [];

          // Pour chaque TAF, récupérer ses programmes
          for (let taf of tafs) {
            const programsQuery = `
              SELECT 
                tp.program_id,
                p.title as program_name
              FROM taf_programs tp
              LEFT JOIN programs p ON tp.program_id = p.id
              WHERE tp.taf_id = ?
            `;
            const programsResult = await this.env.AFFILIATE_DB.prepare(programsQuery).bind(taf.id).all();
            
            taf.program_ids = (programsResult.results || []).map(p => p.program_id);
            taf.programs = programsResult.results || [];
            
            // Rétrocompatibilité
            if (taf.program_ids.length === 0 && taf.program_id) {
              taf.program_ids = [taf.program_id];
              const programQuery = await this.env.AFFILIATE_DB.prepare('SELECT id, title FROM programs WHERE id = ?').bind(taf.program_id).first();
              if (programQuery) {
                taf.programs = [{ program_id: programQuery.id, program_name: programQuery.title }];
                taf.program_name = programQuery.title; // Pour compatibilité avec l'ancien code
              }
            } else if (taf.programs.length > 0) {
              // Pour compatibilité avec l'ancien code, utiliser le premier programme
              taf.program_name = taf.programs[0].program_name;
            }

            // Parser le contenu JSON
            try {
              taf.content = JSON.parse(taf.content);
            } catch (e) {
              taf.content = {};
            }
          }

          return new Response(JSON.stringify({
            success: true,
            tafs: tafs
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      if (method === 'POST') {
        // Créer un nouveau TAF
        const data = await request.json();
        const { start_date, end_date, content, status, program_ids, school_id, program_id } = data;

        if (!start_date || !end_date || !content) {
          return new Response(JSON.stringify({
            success: false,
            error: 'start_date, end_date, and content are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Créer la table de liaison si elle n'existe pas
        await this.env.AFFILIATE_DB.prepare(`
          CREATE TABLE IF NOT EXISTS taf_programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            taf_id INTEGER NOT NULL,
            program_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(taf_id, program_id),
            FOREIGN KEY (taf_id) REFERENCES tafs(id) ON DELETE CASCADE,
            FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
          )
        `).run();

        // Rétrocompatibilité : si program_ids n'existe pas, utiliser program_id
        const finalProgramIds = program_ids || (program_id ? [program_id] : null);
        const firstProgramId = finalProgramIds && finalProgramIds.length > 0 ? finalProgramIds[0] : null;

        const insertQuery = `
          INSERT INTO tafs (start_date, end_date, content, status, program_id, school_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `;

        const contentJson = typeof content === 'string' ? content : JSON.stringify(content);

        const insertResult = await this.env.AFFILIATE_DB.prepare(insertQuery)
          .bind(start_date, end_date, contentJson, status || 'draft', firstProgramId, school_id || null)
          .run();

        const newTafId = insertResult.meta.last_row_id;

        // Insérer les relations avec les programmes
        if (finalProgramIds && finalProgramIds.length > 0) {
          for (const pid of finalProgramIds) {
            try {
              await this.env.AFFILIATE_DB.prepare(`
                INSERT INTO taf_programs (taf_id, program_id)
                VALUES (?, ?)
              `).bind(newTafId, pid).run();
            } catch (e) {
              // Ignorer les doublons
              console.log('Program already linked:', pid);
            }
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'TAF créé avec succès',
          taf_id: newTafId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'PUT' && tafId) {
        // Modifier un TAF
        const data = await request.json();
        const { start_date, end_date, content, status, program_ids, school_id, program_id } = data;

        if (!start_date || !end_date || !content) {
          return new Response(JSON.stringify({
            success: false,
            error: 'start_date, end_date, and content are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Créer la table de liaison si elle n'existe pas
        await this.env.AFFILIATE_DB.prepare(`
          CREATE TABLE IF NOT EXISTS taf_programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            taf_id INTEGER NOT NULL,
            program_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(taf_id, program_id),
            FOREIGN KEY (taf_id) REFERENCES tafs(id) ON DELETE CASCADE,
            FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
          )
        `).run();

        // Rétrocompatibilité : si program_ids n'existe pas, utiliser program_id
        const finalProgramIds = program_ids || (program_id ? [program_id] : []);
        const firstProgramId = finalProgramIds.length > 0 ? finalProgramIds[0] : null;

        const updateQuery = `
          UPDATE tafs
          SET start_date = ?,
              end_date = ?,
              content = ?,
              status = ?,
              program_id = ?,
              school_id = ?,
              updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `;

        const contentJson = typeof content === 'string' ? content : JSON.stringify(content);

        await this.env.AFFILIATE_DB.prepare(updateQuery)
          .bind(start_date, end_date, contentJson, status || 'draft', firstProgramId, school_id || null, tafId)
          .run();

        // Mettre à jour les relations avec les programmes
        // Supprimer toutes les relations existantes
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM taf_programs WHERE taf_id = ?
        `).bind(tafId).run();

        // Insérer les nouvelles relations
        if (finalProgramIds && finalProgramIds.length > 0) {
          for (const pid of finalProgramIds) {
            try {
              await this.env.AFFILIATE_DB.prepare(`
                INSERT INTO taf_programs (taf_id, program_id)
                VALUES (?, ?)
              `).bind(tafId, pid).run();
            } catch (e) {
              // Ignorer les erreurs
              console.log('Error linking program:', pid, e);
            }
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'TAF mis à jour avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'DELETE' && tafId) {
        // Supprimer un TAF
        const deleteQuery = `DELETE FROM tafs WHERE id = ?`;

        await this.env.AFFILIATE_DB.prepare(deleteQuery).bind(tafId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'TAF supprimé avec succès'
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
      console.error('Error in getTafsApi:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion des statuts des membres (activer, désactiver, bannir)
  async getMemberStatusApi(request, user) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      const pathParts = url.pathname.split('/').filter(p => p);
      const memberId = pathParts.length > 3 ? parseInt(pathParts[3]) : null;

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

      if (method === 'POST' && memberId) {
        // Changer le statut d'un membre
        const data = await request.json();
        const { new_status, note } = data;

        // Valider le nouveau statut (1=actif, 0=inactif, 9=banni)
        if (![0, 1, 9].includes(new_status)) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid status. Must be 0 (inactive), 1 (active), or 9 (banned)'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Récupérer le statut actuel du membre
        const currentMember = await this.env.AFFILIATE_DB.prepare(`
          SELECT id, is_active, first_name, last_name, email
          FROM membres
          WHERE id = ?
        `).bind(memberId).first();

        if (!currentMember) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Member not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const oldStatus = currentMember.is_active || 0;

        // Si le statut ne change pas, retourner un message
        if (oldStatus === new_status) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Member already has this status'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Déterminer l'action
        let action = '';
        if (new_status === 1) {
          action = oldStatus === 9 ? 'unban' : 'activate';
        } else if (new_status === 0) {
          action = 'deactivate';
        } else if (new_status === 9) {
          action = 'ban';
        }

        // Mettre à jour le statut du membre
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE membres 
          SET is_active = ?, updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `).bind(new_status, memberId).run();

        // Enregistrer dans l'historique
        await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO member_status_history 
          (membre_id, admin_user_id, old_status, new_status, action, note, created_at)
          VALUES (?, ?, ?, ?, ?, ?, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `).bind(memberId, user.id, oldStatus, new_status, action, note || null).run();

        const statusNames = { 0: 'inactive', 1: 'active', 9: 'banned' };

        return new Response(JSON.stringify({
          success: true,
          message: `Member status changed from ${statusNames[oldStatus]} to ${statusNames[new_status]}`,
          member: {
            id: memberId,
            old_status: oldStatus,
            new_status: new_status,
            action: action
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'GET' && memberId) {
        // Récupérer l'historique d'un membre
        const history = await this.env.AFFILIATE_DB.prepare(`
          SELECT 
            msh.*,
            u.username as admin_username,
            u.email as admin_email,
            m.first_name as member_first_name,
            m.last_name as member_last_name,
            m.email as member_email
          FROM member_status_history msh
          LEFT JOIN users u ON msh.admin_user_id = u.id
          LEFT JOIN membres m ON msh.membre_id = m.id
          WHERE msh.membre_id = ?
          ORDER BY msh.created_at DESC
          LIMIT 50
        `).bind(memberId).all();

        return new Response(JSON.stringify({
          success: true,
          history: history.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed or missing member ID'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API member status:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: School Config - Configuration des écoles
  async getSchoolConfigApi(request, user) {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(p => p);
      // pathParts: ['api', 'school-config'] ou ['api', 'school-config', '1']
      const configId = pathParts.length > 2 ? parseInt(pathParts[2]) : null;

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

      if (method === 'GET') {
        // Créer les colonnes si elles n'existent pas (SQLite ne supporte pas IF NOT EXISTS, on ignore l'erreur)
        try {
          await this.env.AFFILIATE_DB.prepare(`
            ALTER TABLE school_config ADD COLUMN facebook_pixel TEXT
          `).run();
        } catch (e) {
          // La colonne existe peut-être déjà, continuer
          console.log('facebook_pixel column may already exist');
        }
        try {
          await this.env.AFFILIATE_DB.prepare(`
            ALTER TABLE school_config ADD COLUMN google_analytics TEXT
          `).run();
        } catch (e) {
          // La colonne existe peut-être déjà, continuer
          console.log('google_analytics column may already exist');
        }

        // Récupérer toutes les configurations avec le nom de l'école
        const query = `
          SELECT 
            sc.*,
            s.name as school_name
          FROM school_config sc
          LEFT JOIN schools s ON sc.school_id = s.id
          ORDER BY sc.school_id ASC
        `;

        const result = await this.env.AFFILIATE_DB.prepare(query).all();

        return new Response(JSON.stringify({
          success: true,
          configs: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'PUT' && configId) {
        // Créer les colonnes si elles n'existent pas (SQLite ne supporte pas IF NOT EXISTS, on ignore l'erreur)
        try {
          await this.env.AFFILIATE_DB.prepare(`
            ALTER TABLE school_config ADD COLUMN facebook_pixel TEXT
          `).run();
        } catch (e) {
          // La colonne existe peut-être déjà, continuer
          console.log('facebook_pixel column may already exist');
        }
        try {
          await this.env.AFFILIATE_DB.prepare(`
            ALTER TABLE school_config ADD COLUMN google_analytics TEXT
          `).run();
        } catch (e) {
          // La colonne existe peut-être déjà, continuer
          console.log('google_analytics column may already exist');
        }

        // Mettre à jour une configuration
        const data = await request.json();
        const { smtp_token, smtp_email_from, discord_link, skool_link, facebook_pixel, google_analytics } = data;

        await this.env.AFFILIATE_DB.prepare(`
          UPDATE school_config 
          SET 
            smtp_token = ?,
            smtp_email_from = ?,
            discord_link = ?,
            skool_link = ?,
            facebook_pixel = ?,
            google_analytics = ?,
            updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `).bind(
          smtp_token || null,
          smtp_email_from || null,
          discord_link || null,
          skool_link || null,
          facebook_pixel || null,
          google_analytics || null,
          configId
        ).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Configuration mise à jour avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'POST') {
        // Créer les colonnes si elles n'existent pas (SQLite ne supporte pas IF NOT EXISTS, on ignore l'erreur)
        try {
          await this.env.AFFILIATE_DB.prepare(`
            ALTER TABLE school_config ADD COLUMN facebook_pixel TEXT
          `).run();
        } catch (e) {
          // La colonne existe peut-être déjà, continuer
          console.log('facebook_pixel column may already exist');
        }
        try {
          await this.env.AFFILIATE_DB.prepare(`
            ALTER TABLE school_config ADD COLUMN google_analytics TEXT
          `).run();
        } catch (e) {
          // La colonne existe peut-être déjà, continuer
          console.log('google_analytics column may already exist');
        }

        // Créer une nouvelle configuration
        const data = await request.json();
        const { school_id, smtp_token, smtp_email_from, discord_link, skool_link, facebook_pixel, google_analytics } = data;

        if (!school_id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'school_id is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO school_config 
          (school_id, smtp_token, smtp_email_from, discord_link, skool_link, facebook_pixel, google_analytics, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'), STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'))
        `).bind(
          school_id,
          smtp_token || null,
          smtp_email_from || null,
          discord_link || null,
          skool_link || null,
          facebook_pixel || null,
          google_analytics || null
        ).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Configuration créée avec succès'
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
      console.error('❌ Erreur API school config:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Comments - Gestion des commentaires
  async getCommentsApi(request, user) {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(p => p);
      const commentId = pathParts.length > 2 ? parseInt(pathParts[2]) : null;

      if (method === 'GET') {
        // Récupérer tous les commentaires
        const query = `
          SELECT 
            c.*,
            m.first_name || ' ' || m.last_name as author_name,
            m.email as author_email
          FROM comments c
          LEFT JOIN membres m ON c.member_id = m.id
          ORDER BY c.created_at DESC
        `;

        const result = await this.env.AFFILIATE_DB.prepare(query).all();

        return new Response(JSON.stringify({
          success: true,
          comments: result.results || []
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'PUT' && commentId) {
        // Mettre à jour le statut d'un commentaire
        const data = await request.json();
        const { status } = data;

        if (!status || !['active', 'approved', 'pending', 'rejected', 'inactive'].includes(status)) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid status. Must be active, approved, pending, rejected, or inactive'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        await this.env.AFFILIATE_DB.prepare(`
          UPDATE comments
          SET status = ?,
              updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `).bind(status, commentId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Statut du commentaire mis à jour avec succès'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'DELETE' && commentId) {
        // Supprimer un commentaire
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM comments WHERE id = ?
        `).bind(commentId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Commentaire supprimé avec succès'
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
      console.error('❌ Erreur API comments:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: TAF Feedbacks - Gestion des feedbacks TAF
  async getTafFeedbacksApi(request, user) {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(p => p);
      const endpoint = pathParts.length > 2 ? pathParts[2] : null;

      if (method === 'GET' && endpoint === 'ranking') {
        // Récupérer le classement par classe (basé sur le nombre de feedbacks)
        const query = `
          SELECT 
            c.id as class_id,
            c.title as class_name,
            c.code as class_code,
            t.id as taf_id,
            t.content as taf_content,
            p.id as program_id,
            p.title as program_name,
            COUNT(tf.id) as feedback_count,
            MAX(tf.created_at) as last_submission
          FROM taf_feedbacks tf
          INNER JOIN classes c ON tf.class_id = c.id
          INNER JOIN tafs t ON tf.taf_id = t.id
          LEFT JOIN taf_programs tp ON t.id = tp.taf_id
          LEFT JOIN programs p ON tp.program_id = p.id
          WHERE tf.status = 'active'
          GROUP BY c.id, c.title, c.code, t.id, p.id, p.title
          ORDER BY feedback_count DESC, last_submission DESC
        `;

        const result = await this.env.AFFILIATE_DB.prepare(query).all();
        const rankings = result.results || [];

        // Parser le contenu TAF pour obtenir le titre
        rankings.forEach(ranking => {
          if (ranking.taf_content) {
            try {
              const content = typeof ranking.taf_content === 'string' 
                ? JSON.parse(ranking.taf_content) 
                : ranking.taf_content;
              const firstLang = Object.keys(content)[0] || 'fr';
              ranking.taf_title = content[firstLang]?.title || 'TAF #' + ranking.taf_id;
            } catch (e) {
              ranking.taf_title = 'TAF #' + ranking.taf_id;
            }
          } else {
            ranking.taf_title = 'TAF #' + ranking.taf_id;
          }
        });

        return new Response(JSON.stringify({
          success: true,
          rankings: rankings
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'GET') {
        // Récupérer tous les feedbacks avec filtres
        const classId = url.searchParams.get('class_id');
        const tafId = url.searchParams.get('taf_id');

        let query = `
          SELECT 
            tf.*,
            m.first_name || ' ' || m.last_name as member_name,
            m.email as member_email,
            c.id as class_id,
            c.title as class_name,
            c.code as class_code,
            t.id as taf_id,
            t.content as taf_content
          FROM taf_feedbacks tf
          INNER JOIN membres m ON tf.member_id = m.id
          INNER JOIN classes c ON tf.class_id = c.id
          LEFT JOIN tafs t ON tf.taf_id = t.id
          WHERE 1=1
        `;

        const params = [];
        if (classId) {
          query += ` AND c.id = ?`;
          params.push(classId);
        }
        if (tafId) {
          query += ` AND t.id = ?`;
          params.push(tafId);
        }

        query += ` ORDER BY tf.created_at DESC`;

        const result = await this.env.AFFILIATE_DB.prepare(query).bind(...params).all();
        const feedbacks = result.results || [];

        // Parser le contenu TAF pour obtenir le titre
        feedbacks.forEach(feedback => {
          if (feedback.taf_content) {
            try {
              const content = typeof feedback.taf_content === 'string' 
                ? JSON.parse(feedback.taf_content) 
                : feedback.taf_content;
              const firstLang = Object.keys(content)[0] || 'fr';
              feedback.taf_title = content[firstLang]?.title || 'TAF #' + feedback.taf_id;
            } catch (e) {
              feedback.taf_title = 'TAF #' + feedback.taf_id;
            }
          } else {
            feedback.taf_title = 'TAF #' + feedback.taf_id;
          }
        });

        return new Response(JSON.stringify({
          success: true,
          feedbacks: feedbacks
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (method === 'PUT') {
        // Mettre à jour l'évaluation d'un feedback
        const data = await request.json();
        const { id, evaluation, evaluation_data, evaluation_status } = data;

        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Feedback ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Préparer les données d'évaluation en JSON
        let evaluationDataJson = null;
        if (evaluation_data) {
          try {
            evaluationDataJson = typeof evaluation_data === 'string' 
              ? evaluation_data 
              : JSON.stringify(evaluation_data);
          } catch (e) {
            evaluationDataJson = JSON.stringify({ comment: evaluation_data });
          }
        }

        // Mettre à jour le feedback avec l'évaluation
        const updateQuery = `
          UPDATE taf_feedbacks 
          SET 
            evaluation = ?,
            evaluation_data = ?,
            evaluation_status = ?,
            evaluation_date = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'),
            evaluator_id = 7,
            updated_at = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW')
          WHERE id = ?
        `;

        await this.env.AFFILIATE_DB.prepare(updateQuery).bind(
          evaluation || null,
          evaluationDataJson,
          evaluation_status || 'pending',
          id
        ).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Évaluation enregistrée avec succès'
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
      console.error('❌ Erreur API taf-feedbacks:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Générer une évaluation avec OpenAI
  async generateEvaluationApi(request, user) {
    try {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await request.json();
      const { feedback_id, feedback_text, member_name, class_code, taf_title } = data;

      if (!feedback_id || !feedback_text) {
        return new Response(JSON.stringify({
          success: false,
          error: 'feedback_id and feedback_text are required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Vérifier que la clé API OpenAI est disponible
      const openaiApiKey = this.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return new Response(JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Importer le prompt
      const { EVALUATION_PROMPT } = await import('../data/prompts.js');

      // Construire le message pour OpenAI
      const userMessage = `Rapport d'avancement de l'équipe:\n\nRapporteur: ${member_name || 'Non spécifié'}\nClasse: ${class_code || 'Non spécifiée'}\nTAF: ${taf_title || 'Non spécifié'}\n\nContenu du rapport:\n${feedback_text}`;

      // Appeler l'API OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: EVALUATION_PROMPT
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error('OpenAI API Error:', errorData);
        return new Response(JSON.stringify({
          success: false,
          error: 'OpenAI API error: ' + openaiResponse.statusText
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const openaiResult = await openaiResponse.json();
      const generatedContent = openaiResult.choices[0]?.message?.content;

      if (!generatedContent) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No content generated by OpenAI'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Parser le JSON généré
      let evaluationData;
      try {
        evaluationData = JSON.parse(generatedContent);
        console.log('Parsed evaluation data:', evaluationData);
      } catch (e) {
        console.error('Error parsing OpenAI JSON:', e);
        console.error('Raw content:', generatedContent);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid JSON from OpenAI: ' + e.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Construire le commentaire d'évaluation à partir des données générées
      let evaluationComment = '';
      if (evaluationData.commentaire_equipe) {
        evaluationComment = evaluationData.commentaire_equipe;
      }

      console.log('Returning evaluation:', {
        evaluation: evaluationComment,
        evaluation_data: evaluationData,
        evaluation_status: 'pending'
      });

      return new Response(JSON.stringify({
        success: true,
        evaluation: {
          evaluation: evaluationComment,
          evaluation_data: evaluationData,
          evaluation_status: 'pending'
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API generate-evaluation:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Traitement automatique des feedbacks (batch de 5)
  async processFeedbackEvaluationBatchApi(request, user) {
    try {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Vérifier que la clé API OpenAI est disponible
      const openaiApiKey = this.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return new Response(JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Récupérer les feedbacks non évalués (nombre configuré via variable d'environnement)
      const batchSize = parseInt(this.env.FEEDBACK_BATCH_SIZE || '50', 10);
      
      const query = `
        SELECT 
          tf.id,
          tf.feedback_text,
          tf.taf_id,
          tf.class_id,
          tf.member_id,
          m.first_name || ' ' || m.last_name as member_name,
          c.code as class_code,
          t.content as taf_content
        FROM taf_feedbacks tf
        LEFT JOIN membres m ON tf.member_id = m.id
        LEFT JOIN classes c ON tf.class_id = c.id
        LEFT JOIN tafs t ON tf.taf_id = t.id
        WHERE (tf.evaluation IS NULL OR tf.evaluation = '')
          AND (tf.evaluation_status IS NULL OR tf.evaluation_status = '')
          AND tf.feedback_text IS NOT NULL 
          AND tf.feedback_text != ''
          AND LENGTH(TRIM(tf.feedback_text)) >= 10
        ORDER BY tf.created_at ASC
        LIMIT ?
      `;
      
      const queryResult = await this.env.AFFILIATE_DB.prepare(query).bind(batchSize).all();
      const feedbacks = queryResult.results || [];

      if (feedbacks.length === 0) {
        return new Response(JSON.stringify({
          success: true,
          processed: 0,
          approved: 0,
          needs_revision: 0,
          errors: [],
          message: 'Aucun feedback à traiter'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log(`📦 Traitement de ${feedbacks.length} feedback(s) non traité(s) (batch size: ${batchSize})...`);

      // Importer le prompt
      const { EVALUATION_PROMPT } = await import('../data/prompts.js');

      let processed = 0;
      let approved = 0;
      let needs_revision = 0;
      const errors = [];

      // Traiter chaque feedback
      for (const feedback of feedbacks) {
        try {
          // Extraire le titre du TAF
          let tafTitle = 'TAF #' + feedback.taf_id;
          if (feedback.taf_content) {
            try {
              const tafContent = typeof feedback.taf_content === 'string' 
                ? JSON.parse(feedback.taf_content) 
                : feedback.taf_content;
              const firstLang = Object.keys(tafContent)[0] || 'fr';
              tafTitle = tafContent[firstLang]?.title || tafTitle;
            } catch (e) {
              console.warn('Erreur parsing taf_content:', e);
            }
          }

          // Construire le message pour OpenAI
          const userMessage = `Rapport d'avancement de l'équipe:\n\nRapporteur: ${feedback.member_name || 'Non spécifié'}\nClasse: ${feedback.class_code || 'Non spécifiée'}\nTAF: ${tafTitle}\n\nContenu du rapport:\n${feedback.feedback_text}`;

          // Appeler l'API OpenAI
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: EVALUATION_PROMPT
                },
                {
                  role: 'user',
                  content: userMessage
                }
              ],
              temperature: 0.7,
              response_format: { type: 'json_object' }
            })
          });

          if (!openaiResponse.ok) {
            const errorData = await openaiResponse.text();
            console.error(`❌ OpenAI API Error pour feedback ${feedback.id}:`, errorData);
            errors.push({
              feedback_id: feedback.id,
              error: 'OpenAI API error: ' + openaiResponse.statusText
            });
            continue;
          }

          const openaiResult = await openaiResponse.json();
          const generatedContent = openaiResult.choices[0]?.message?.content;

          if (!generatedContent) {
            errors.push({
              feedback_id: feedback.id,
              error: 'No content generated by OpenAI'
            });
            continue;
          }

          // Parser le JSON généré
          let evaluationData;
          try {
            evaluationData = JSON.parse(generatedContent);
          } catch (e) {
            console.error(`❌ Error parsing OpenAI JSON pour feedback ${feedback.id}:`, e);
            errors.push({
              feedback_id: feedback.id,
              error: 'Invalid JSON from OpenAI: ' + e.message
            });
            continue;
          }

          // Extraire le content_type et déterminer le statut
          const contentType = evaluationData.content_type || 'incomplet';
          const evaluationStatus = contentType === 'compte_rendu' ? 'approved' : 'needs_revision';

          // Construire le commentaire d'évaluation
          let evaluationComment = '';
          if (evaluationData.commentaire_equipe) {
            evaluationComment = evaluationData.commentaire_equipe;
          }

          // Mettre à jour le feedback dans la base de données
          await this.env.AFFILIATE_DB.prepare(`
            UPDATE taf_feedbacks 
            SET evaluation = ?,
                evaluation_data = ?,
                evaluation_status = ?,
                evaluation_date = STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW'),
                evaluator_id = 7
            WHERE id = ?
          `).bind(
            evaluationComment,
            JSON.stringify(evaluationData),
            evaluationStatus,
            feedback.id
          ).run();

          processed++;
          if (evaluationStatus === 'approved') {
            approved++;
          } else {
            needs_revision++;
          }

          console.log(`✅ Feedback ${feedback.id} traité: ${evaluationStatus} (${contentType})`);

        } catch (error) {
          console.error(`❌ Erreur traitement feedback ${feedback.id}:`, error);
          errors.push({
            feedback_id: feedback.id,
            error: error.message
          });
        }
      }

      return new Response(JSON.stringify({
        success: true,
        processed: processed,
        approved: approved,
        needs_revision: needs_revision,
        errors: errors,
        batch_size: batchSize,
        message: `Traitement terminé: ${processed} feedback(s) traité(s)`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('❌ Erreur API process-feedback-evaluation-batch:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

}
