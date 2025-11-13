// ===== MODULE AUTHENTIFICATION - W-AffBooster =====
// Gestion de l'authentification, sessions et permissions

export class AuthModule {
  constructor() {
    this.env = null;
  }

  // Initialisation avec l'environnement
  init(env) {
    this.env = env;
  }

  // ===== AUTHENTIFICATION =====

  // Hasher un mot de passe avec SHA-256
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Vérifier un mot de passe
  async verifyPassword(password, hash) {
    const hashedPassword = await this.hashPassword(password);
    return hashedPassword === hash;
  }

  // Authentifier un utilisateur
  async login(credentials, request) {
    try {
      const { email, password } = credentials;
      
      console.log('🔐 Login attempt for:', email);
      
      // Vérifier les credentials
      const user = await this.env.AFFILIATE_DB.prepare(`
        SELECT id, username, email, password_hash, role, permissions, is_active
        FROM users 
        WHERE email = ? AND is_active = 1
      `).bind(email).first();
      
      if (!user) {
        console.log('❌ User not found:', email);
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      
      const passwordMatch = await this.verifyPassword(password, user.password_hash);
      if (!passwordMatch) {
        console.log('❌ Password mismatch for:', email);
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      
      console.log('✅ Login successful for:', email);
      
      // Créer une session
      const sessionResult = await this.createSession(user.id, request);
      
      if (!sessionResult.success) {
        return {
          success: false,
          error: 'Failed to create session'
        };
      }
      
      // Parser les permissions en toute sécurité
      let permissions = [];
      try {
        if (user.permissions) {
          permissions = typeof user.permissions === 'string' 
            ? JSON.parse(user.permissions) 
            : user.permissions;
        }
      } catch (parseError) {
        console.error('❌ Error parsing permissions:', parseError);
        permissions = [];
      }
      
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: permissions
        },
        sessionId: sessionResult.sessionId,
        cookie: sessionResult.cookie
      };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // ===== GESTION DES SESSIONS =====

  // Créer une nouvelle session
  async createSession(userId, request) {
    try {
      const sessionId = crypto.randomUUID();
      const refreshToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      
      await this.env.AFFILIATE_DB.prepare(`
        INSERT INTO sessions (id, user_id, refresh_token, access_token_hash, expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sessionId,
        userId,
        refreshToken,
        sessionId,
        expiresAt.toISOString(),
        request.headers.get('CF-Connecting-IP') || '127.0.0.1',
        request.headers.get('User-Agent') || 'Cloudflare Worker'
      ).run();
      
      console.log('✅ Session created:', sessionId);
      
      // Mettre à jour last_login
      await this.env.AFFILIATE_DB.prepare(`
        UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(userId).run();
      
      return {
        success: true,
        sessionId,
        cookie: `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      };
      
    } catch (error) {
      console.error('❌ Error creating session:', error);
      return {
        success: false,
        error: 'Failed to create session'
      };
    }
  }

  // Récupérer l'utilisateur depuis la session
  async getUserFromSession(request) {
    try {
      console.log('🔍 Getting user from session...');
      const cookies = request.headers.get('Cookie') || '';
      console.log('🍪 Cookies:', cookies.substring(0, 100) + '...');
      
      const sessionMatch = cookies.match(/session=([^;]+)/);
      console.log('🔍 Session match:', !!sessionMatch);
      
      if (!sessionMatch) {
        console.log('❌ No session cookie found');
        return null;
      }
      
      const sessionId = sessionMatch[1];
      console.log('🔍 Session ID:', sessionId.substring(0, 20) + '...');
      
      const user = await this.env.AFFILIATE_DB.prepare(`
        SELECT u.id, u.username, u.email, u.role, u.permissions, u.is_active
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ? AND s.is_active = 1 AND u.is_active = 1 AND s.expires_at > datetime('now')
      `).bind(sessionId).first();
      
      console.log('👤 User found:', user ? { id: user.id, username: user.username } : null);
      return user;
      
    } catch (error) {
      console.error('❌ Error getting user from session:', error);
      return null;
    }
  }

  // Rafraîchir une session
  async refreshSession(refreshToken) {
    try {
      const session = await this.env.AFFILIATE_DB.prepare(`
        SELECT s.id, s.user_id, s.expires_at, u.username, u.role, u.permissions
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.refresh_token = ? AND s.is_active = 1 AND u.is_active = 1
      `).bind(refreshToken).first();
      
      if (!session) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }
      
      // Vérifier si la session n'est pas expirée
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      
      if (now > expiresAt) {
        return {
          success: false,
          error: 'Session expired'
        };
      }
      
      // Créer une nouvelle session
      const newSessionId = crypto.randomUUID();
      const newRefreshToken = crypto.randomUUID();
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      
      await this.env.AFFILIATE_DB.prepare(`
        UPDATE sessions 
        SET id = ?, refresh_token = ?, expires_at = ?, last_used = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(newSessionId, newRefreshToken, newExpiresAt.toISOString(), session.id).run();
      
      return {
        success: true,
        sessionId: newSessionId,
        refreshToken: newRefreshToken,
        cookie: `session=${newSessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      };
      
    } catch (error) {
      console.error('❌ Error refreshing session:', error);
      return {
        success: false,
        error: 'Failed to refresh session'
      };
    }
  }

  // Invalider une session (logout)
  async invalidateSession(request) {
    try {
      const cookies = request.headers.get('Cookie') || '';
      const sessionMatch = cookies.match(/session=([^;]+)/);
      
      if (sessionMatch) {
        const sessionId = sessionMatch[1];
        await this.env.AFFILIATE_DB.prepare(`
          UPDATE sessions SET is_active = 0 WHERE id = ?
        `).bind(sessionId).run();
        
        console.log('✅ Session invalidated:', sessionId);
      }
      
      return {
        success: true,
        cookie: 'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      };
      
    } catch (error) {
      console.error('❌ Error invalidating session:', error);
      return {
        success: false,
        error: 'Failed to invalidate session'
      };
    }
  }

  // ===== GESTION DES PERMISSIONS =====

  // Vérifier une permission spécifique
  async checkPermission(userId, permission, env = null) {
    try {
      const db = env || this.env;
      
      const user = await db.prepare(`
        SELECT permissions FROM users WHERE id = ? AND is_active = 1
      `).bind(userId).first();
      
      if (!user) {
        return false;
      }
      
      const permissions = JSON.parse(user.permissions);
      return permissions.includes(permission);
      
    } catch (error) {
      console.error('❌ Error checking permission:', error);
      return false;
    }
  }

  // Vérifier le rôle de l'utilisateur
  async getUserRole(userId, env = null) {
    try {
      const db = env || this.env;
      
      const user = await db.prepare(`
        SELECT role FROM users WHERE id = ? AND is_active = 1
      `).bind(userId).first();
      
      return user ? user.role : null;
      
    } catch (error) {
      console.error('❌ Error getting user role:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est admin
  async isAdmin(userId, env = null) {
    const role = await this.getUserRole(userId, env);
    return role === 'admin';
  }

  // ===== GESTION DES UTILISATEURS =====


  // Mettre à jour un utilisateur
  async updateUser(userId, userData, env = null) {
    try {
      const db = env || this.env;
      
      const updateFields = [];
      const values = [];
      
      if (userData.firstName) {
        updateFields.push('first_name = ?');
        values.push(userData.firstName);
      }
      
      if (userData.lastName) {
        updateFields.push('last_name = ?');
        values.push(userData.lastName);
      }
      
      if (userData.email) {
        updateFields.push('email = ?');
        values.push(userData.email);
      }
      
      if (userData.phone) {
        updateFields.push('phone = ?');
        values.push(userData.phone);
      }
      
      if (userData.address) {
        updateFields.push('address = ?');
        values.push(userData.address);
      }
      
      if (userData.city) {
        updateFields.push('city = ?');
        values.push(userData.city);
      }
      
      if (userData.country) {
        updateFields.push('country = ?');
        values.push(userData.country);
      }
      
      if (userData.website) {
        updateFields.push('website = ?');
        values.push(userData.website);
      }
      
      if (updateFields.length === 0) {
        return {
          success: false,
          error: 'No fields to update'
        };
      }
      
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);
      
      await db.prepare(`
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).bind(...values).run();
      
      return {
        success: true,
        message: 'User updated successfully'
      };
      
    } catch (error) {
      console.error('❌ Error updating user:', error);
      return {
        success: false,
        error: 'Failed to update user'
      };
    }
  }

  // ===== UTILITAIRES =====


  // Nettoyer les données utilisateur
  sanitizeUserData(userData) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  // ===== GESTION DES ERREURS =====

  // Gérer les erreurs d'authentification
  handleAuthError(error, context = 'Authentication') {
    console.error(`❌ ${context} error:`, error);
    
    return {
      success: false,
      error: 'Authentication failed',
      message: error.message
    };
  }

  // Logger les tentatives d'authentification
  logAuthAttempt(username, success, ip, userAgent) {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    
    console.log(`🔐 Auth attempt: ${username} - ${status} - ${ip} - ${timestamp}`);
    
    // Ici on pourrait ajouter un système de logging plus avancé
    // ou envoyer les logs vers un service externe
  }
}
