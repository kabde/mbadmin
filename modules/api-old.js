// ===== MODULE API - W-AffBooster =====
// Gestion de toutes les routes API (/api/*)

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

  // API: Récupérer les offres avec filtres et pagination
  async getOffersApi(request, user) {
    try {
      console.log('🔍 getOffersApi called for user:', user.id);
      const url = new URL(request.url);
      const filters = this.parseApiFilters(url);
      
      console.log('🔍 Recherche d\'offres avec filtres:', filters);
      
      // Récupérer toutes les offres actives
      console.log('🔄 Calling getAllOffersFromD1...');
      const allOffers = await this.getAllOffersFromD1();
      console.log('📦 Retrieved offers count:', allOffers.length);
      
      // Appliquer les filtres
      let filteredOffers = this.applyOffersFilters(allOffers, filters);
      console.log('🔍 Filtered offers count:', filteredOffers.length);
      
      // Pagination
      const paginatedOffers = this.paginateResults(filteredOffers, filters);
      console.log('📄 Paginated offers count:', paginatedOffers.offers.length);
      
      const response = {
        success: true,
        offers: paginatedOffers.offers,
        pagination: paginatedOffers.pagination
      };
      
      console.log('✅ API response prepared:', response);
      
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur récupération offres:', error);
      console.error('❌ Stack trace:', error.stack);
      return this.handleApiError(error, 'Failed to fetch offers');
    }
  }

  // API: Récupérer les offres assignées à l'utilisateur
  async getMyOffersApi(request, user) {
    try {
      console.log(`🔍 Récupération des offres pour l'utilisateur: ${user.id}`);
      const offers = await this.getUserOffers(user.id);
      console.log(`✅ ${offers.length} offres récupérées pour l'utilisateur ${user.id}`);
      
      return new Response(JSON.stringify({ 
        success: true,
        offers,
        total: offers.length 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('❌ Erreur récupération mes offres:', error);
      return this.handleApiError(error, 'Failed to fetch my offers');
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

  // API: Appliquer à une offre
  async applyOfferApi(request, user) {
    try {
      const body = await request.json();
      const { offerId } = body;
      
      if (!offerId) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Offer ID is required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Vérifier que l'offre existe
      const offers = await this.getAllOffersFromD1();
      console.log('Looking for offer ID:', offerId, 'type:', typeof offerId);
      console.log('Available offers:', offers.map(o => ({ id: o.id, type: typeof o.id })));
      
      const offer = offers.find(o => {
        console.log('Checking offer ID:', o.id, 'type:', typeof o.id, 'matches:', o.id == offerId);
        return o.id == offerId; // Use == for type coercion
      });
      
      if (!offer) {
        console.log('Offer not found:', offerId);
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Offer not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Vérifier si l'utilisateur a déjà accès à cette offre
      const existingAccess = await this.env.AFFILIATE_DB.prepare(`
        SELECT uo.id FROM user_offers uo
        JOIN offers o ON uo.offer_id = o.id
        WHERE uo.user_id = ? AND uo.offer_id = ? 
        AND uo.is_active = 1 
        AND o.status = 'active'
        AND (uo.expires_at IS NULL OR uo.expires_at > datetime('now'))
      `).bind(user.id, offerId).first();
      
      if (existingAccess) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'You already have access to this offer' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Vérifier s'il y a un enregistrement inactif ou expiré
      const inactiveAccess = await this.env.AFFILIATE_DB.prepare(`
        SELECT uo.id, uo.is_active, uo.expires_at FROM user_offers uo
        WHERE uo.user_id = ? AND uo.offer_id = ?
      `).bind(user.id, offerId).first();
      
      if (inactiveAccess) {
        // Réactiver l'accès existant
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE user_offers 
          SET is_active = 1, 
              assigned_at = datetime('now'),
              expires_at = NULL
          WHERE user_id = ? AND offer_id = ?
        `).bind(user.id, offerId).run();
        
        console.log(`✅ Reactivated access for user ${user.id} to offer ${offerId}`);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Successfully reactivated access to offer',
          offer: {
            id: offer.id,
            nom: offer.nom,
            network: offer.network,
            payout: offer.payout
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Créer l'accès automatique à l'offre
      await this.env.AFFILIATE_DB.prepare(`
        INSERT INTO user_offers (
          user_id, offer_id, permissions, payout, is_active, 
          assigned_at, assigned_by
        ) VALUES (?, ?, ?, ?, 1, datetime('now'), ?)
      `).bind(
        user.id, 
        offerId, 
        JSON.stringify(['read', 'stats']), // Permissions par défaut
        offer.payout, // Payout par défaut de l'offre
        user.id // Auto-assigné par l'utilisateur
      ).run();
      
      console.log(`✅ User ${user.id} applied to offer ${offerId}`);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Successfully applied to offer',
        offer: {
          id: offer.id,
          nom: offer.nom,
          network: offer.network,
          payout: offer.payout
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur application offre:', error);
      return this.handleApiError(error, 'Failed to apply to offer');
    }
  }

  // API: Vérifier le statut d'une offre
  async checkOfferStatusApi(request, user) {
    try {
      const url = new URL(request.url);
      const offerId = url.searchParams.get('offer_id');
      
      if (!offerId) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Offer ID is required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Vérifier le statut complet de l'offre pour l'utilisateur
      const offerStatus = await this.env.AFFILIATE_DB.prepare(`
        SELECT 
          uo.id, uo.is_active, uo.expires_at, uo.assigned_at,
          o.id as offer_id, o.nom, o.status as offer_status
        FROM user_offers uo
        LEFT JOIN offers o ON uo.offer_id = o.id
        WHERE uo.user_id = ? AND uo.offer_id = ?
      `).bind(user.id, offerId).first();
      
      if (!offerStatus) {
        return new Response(JSON.stringify({ 
          success: true,
          hasAccess: false,
          status: 'not_assigned'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const now = new Date().toISOString();
      const isExpired = offerStatus.expires_at && offerStatus.expires_at < now;
      const isActive = offerStatus.is_active && !isExpired && offerStatus.offer_status === 'active';
      
      return new Response(JSON.stringify({ 
        success: true,
        hasAccess: isActive,
        status: isActive ? 'active' : (isExpired ? 'expired' : 'inactive'),
        details: {
          isActive: offerStatus.is_active,
          isExpired,
          offerStatus: offerStatus.offer_status,
          assignedAt: offerStatus.assigned_at,
          expiresAt: offerStatus.expires_at
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur vérification statut offre:', error);
      return this.handleApiError(error, 'Failed to check offer status');
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

  // API: Métadonnées des offres
  async getOffersMetadataApi(request, user) {
    try {
      const allOffers = await this.getAllOffersFromD1();
      
      // Extraire les métadonnées uniques
      const networks = [...new Set(allOffers.map(o => o.network))].sort();
      const categories = [...new Set(allOffers.map(o => o.category))].sort();
      const countries = [...new Set(allOffers.flatMap(o => o.geo))].sort();
      const payoutRange = {
        min: Math.min(...allOffers.map(o => o.payout)),
        max: Math.max(...allOffers.map(o => o.payout))
      };
      
      return new Response(JSON.stringify({ 
        success: true,
        metadata: {
          networks,
          categories,
          countries,
          payoutRange,
          totalOffers: allOffers.length
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur récupération métadonnées:', error);
      return this.handleApiError(error, 'Failed to fetch metadata');
    }
  }

  // API: Debug utilisateur
  async getDebugUserOffersApi(request, user) {
    try {
      console.log(`🔍 Debug: Vérification des offres pour l'utilisateur ${user.id}`);
      
      // Vérifier les enregistrements user_offers
      const userOffers = await this.env.AFFILIATE_DB.prepare(`
        SELECT * FROM user_offers WHERE user_id = ?
      `).bind(user.id).all();
      
      console.log(`🔍 Debug: ${userOffers.results.length} enregistrements user_offers trouvés`);
      
      // Vérifier les offres actives
      const activeOffers = await this.env.AFFILIATE_DB.prepare(`
        SELECT COUNT(*) as count FROM offers WHERE status = 'active'
      `).bind().first();
      
      console.log(`🔍 Debug: ${activeOffers.count} offres actives dans la base`);
      
      return new Response(JSON.stringify({ 
        success: true,
        debug: {
          userId: user.id,
          userOffersCount: userOffers.results.length,
          userOffers: userOffers.results,
          activeOffersCount: activeOffers.count
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Erreur debug:', error);
      return this.handleApiError(error, 'Debug failed');
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

  // Appliquer les filtres aux offres
  applyOffersFilters(offers, filters) {
    let filteredOffers = [...offers];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOffers = filteredOffers.filter(offer => 
        offer.nom.toLowerCase().includes(searchTerm) ||
        offer.description?.toLowerCase().includes(searchTerm) ||
        offer.network.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.network) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.network.toLowerCase() === filters.network.toLowerCase()
      );
    }
    
    if (filters.category) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.country) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.geo.includes(filters.country.toUpperCase())
      );
    }
    
    if (filters.min_payout) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.payout >= parseFloat(filters.min_payout)
      );
    }
    
    if (filters.max_payout) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.payout <= parseFloat(filters.max_payout)
      );
    }
    
    // Tri
    if (filters.sort) {
      switch (filters.sort) {
        case 'name':
          filteredOffers.sort((a, b) => a.nom.localeCompare(b.nom));
          break;
        case 'payout_asc':
          filteredOffers.sort((a, b) => a.payout - b.payout);
          break;
        case 'payout_desc':
          filteredOffers.sort((a, b) => b.payout - a.payout);
          break;
        case 'updated':
          filteredOffers.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          break;
      }
    }
    
    return filteredOffers;
  }

  // Pagination des résultats
  paginateResults(results, filters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    const paginatedResults = results.slice(offset, offset + limit);
    
    return {
      offers: paginatedResults,
      pagination: {
        page,
        limit,
        total: results.length,
        pages: Math.ceil(results.length / limit)
      }
    };
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

  // ===== MÉTHODES DE DONNÉES (À DÉPLACER VERS DatabaseModule) =====

  // Récupérer toutes les offres depuis D1
  async getAllOffersFromD1() {
    try {
      console.log('🔄 Lecture des offres depuis D1...');
      const result = await this.env.AFFILIATE_DB.prepare(`
        SELECT 
          id, nom, network, payout, offer_link, status, category, channel,
          geo, preview_url, description, target_audience, 
          created_at, updated_at, created_by, images
        FROM offers 
        WHERE status = 'active'
        ORDER BY updated_at DESC
      `).all();
      
      console.log(`✅ ${result.results.length} offres lues depuis D1`);
      return result.results.map(offer => ({
        ...offer,
        geo: offer.geo ? JSON.parse(offer.geo) : [],
        images: offer.images ? JSON.parse(offer.images) : []
      }));
      
    } catch (error) {
      console.error('❌ Erreur lors de la lecture des offres:', error);
      throw new Error('Failed to load offers from database');
    }
  }

  // Récupérer les offres assignées à l'utilisateur
  async getUserOffers(userId) {
    try {
      console.log(`🔍 getUserOffers: Recherche des offres pour l'utilisateur ${userId}`);
      
      const result = await this.env.AFFILIATE_DB.prepare(`
        SELECT 
          o.id, o.nom, o.network, o.payout, o.offer_link, o.status, o.category, 
          o.geo, o.preview_url, o.description, o.target_audience, 
          o.created_at, o.updated_at, o.created_by, o.images,
          uo.permissions, 
          uo.payout as custom_payout,
          uo.is_active, 
          uo.expires_at,
          uo.assigned_at,
          uo.assigned_by
        FROM offers o
        JOIN user_offers uo ON o.id = uo.offer_id
        WHERE uo.user_id = ? AND uo.is_active = 1
        AND o.status = 'active'
        AND (uo.expires_at IS NULL OR uo.expires_at > datetime('now'))
        ORDER BY o.updated_at DESC
      `).bind(userId).all();
      
      console.log(`✅ ${result.results.length} offres assignées trouvées pour l'utilisateur ${userId}`);
      
      return result.results.map(offer => ({
        ...offer,
        geo: offer.geo ? JSON.parse(offer.geo) : [],
        images: offer.images ? JSON.parse(offer.images) : [],
        permissions: offer.permissions ? JSON.parse(offer.permissions) : []
      }));
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres utilisateur:', error);
      throw new Error('Failed to get user offers');
    }
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

  // API: Récupérer toutes les offres (Admin seulement)
  async getAdminOffersApi(request, user) {
    try {
      console.log('🔍 getAdminOffersApi called for user:', user?.id, 'role:', user?.role);
      console.log('🔍 Request method:', request.method);
      console.log('🔍 User object:', JSON.stringify(user, null, 2));
      
      // Vérifier que l'utilisateur est admin
      if (user.role !== 'admin') {
        console.log('❌ Access denied - user is not admin');
        return new Response(JSON.stringify({
          success: false,
          error: 'Access denied. Admin role required.'
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'GET') {
        console.log('🔄 Fetching all offers from database...');
        const offers = await this.env.AFFILIATE_DB.prepare(`
          SELECT 
            id, nom, network, payout, payout_partner, offer_link, status, category, channel, offer_id_partner, geo,
            preview_url, images, description, target_audience, created_at, updated_at, created_by
          FROM offers 
          ORDER BY created_at DESC
        `).all();

        console.log('📦 Retrieved offers from database:', offers.results?.length || 0);
        console.log('📊 First offer sample:', offers.results?.[0]);

        const response = {
          success: true,
          offers: offers.results || []
        };
        
        console.log('✅ Admin offers API response prepared:', response);
        
        return new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const offerData = await request.json();
        
        // Utiliser l'auto-increment - ne pas spécifier l'ID
        const result = await this.env.AFFILIATE_DB.prepare(`
          INSERT INTO offers (
            nom, network, payout, payout_partner, offer_link, status, category, channel, offer_id_partner, geo,
            preview_url, images, description, target_audience, created_by, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
          offerData.nom,
          offerData.network,
          offerData.payout,
          offerData.payout_partner || null,
          offerData.offer_link,
          offerData.status || 'active',
          offerData.category,
          offerData.channel || null,
          offerData.offer_id_partner || null,
          offerData.geo || null,
          offerData.preview_url || null,
          offerData.images || null,
          offerData.description || null,
          offerData.target_audience || null,
          user.id
        ).run();
        
        // Récupérer l'ID auto-généré
        const offerId = result.meta.last_row_id;
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Offer created successfully', 
          offerId: offerId 
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
      console.error('❌ Erreur API getAdminOffers:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage offers: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // API: Gestion d'une offre spécifique par ID (PUT, DELETE)
  async getAdminOfferByIdApi(request, user, offerId) {
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

      if (request.method === 'PUT') {
        const offerData = await request.json();
        
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE offers SET
            nom = ?, network = ?, payout = ?, payout_partner = ?, offer_link = ?, status = ?, 
            category = ?, channel = ?, offer_id_partner = ?, geo = ?, preview_url = ?, images = ?, 
            description = ?, target_audience = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(
          offerData.nom,
          offerData.network,
          offerData.payout,
          offerData.payout_partner || null,
          offerData.offer_link,
          offerData.status,
          offerData.category,
          offerData.channel || null,
          offerData.offer_id_partner || null,
          offerData.geo,
          offerData.preview_url,
          offerData.images,
          offerData.description,
          offerData.target_audience,
          offerId
        ).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Offer updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'DELETE') {
        await this.env.AFFILIATE_DB.prepare(`
          DELETE FROM offers WHERE id = ?
        `).bind(offerId).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Offer deleted successfully'
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
      console.error('❌ Erreur API getAdminOfferById:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to manage offer'
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

  
  // Méthode pour récupérer une offre par son ID
  async getOfferById(offerId) {
    try {
      console.log('🔍 Getting offer by ID:', offerId);
      
      const result = await this.env.AFFILIATE_DB.prepare(`
        SELECT id, nom, offer_link, status, network, payout, category, geo,
               preview_url, images, description, target_audience, 
               created_at, updated_at, created_by
        FROM offers 
        WHERE id = ? AND status = 'active'
      `).bind(offerId).first();
      
      if (!result) {
        console.log('❌ Offer not found or inactive:', offerId);
        return null;
      }
      
      console.log('✅ Offer found:', result.nom);
      return result;
      
    } catch (error) {
      console.error('❌ Error getting offer by ID:', error);
      throw error;
    }
  }
}
