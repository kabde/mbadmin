// ===== WORKER TEST - Migration Modules API + Auth + Pages =====
// Test de la migration des modules API, Authentification et Pages

import { ApiModule } from './modules/api.js';
import { AuthModule } from './modules/auth.js';
import { getHomePage } from './pages/home.js';
import { getLoginPage } from './pages/login.js';
import { getSupportPage } from './pages/support.js';
import { getProfilePage } from './pages/profile.js';
import { getProgramsPage } from './pages/programs.js';
import { getVideosPage } from './pages/videos.js';
import { getVideoEditPage } from './pages/video-edit.js';
import { getSpeakersPage } from './pages/speakers.js';
import { getMembersPage } from './pages/members.js';
import { getMemberManagePage } from './pages/member-manage.js';
import { getSchoolFieldsPage } from './pages/school-fields.js';
import { getClassesPage } from './pages/classes.js';
import { getSchoolsPage } from './pages/schools.js';
import { getQuizzesPage, getQuizParticipantsPage, getQuizQuestionsPage } from './pages/quizzes.js';
import { getCoursesPage } from './pages/courses.js';
import { getCourseViewPage } from './pages/course-view.js';
import { getCourseEditPage } from './pages/course-edit.js';
import { getModulesPage } from './pages/modules.js';
import { getReclamationsPage } from './pages/reclamations.js';
import { getDashboardPage } from './pages/dashboard.js';
import { getTafsPage } from './pages/tafs.js';
import { getTafEditPage } from './pages/taf-edit.js';
import { getTafFeedbacksPage } from './pages/taf-feedbacks.js';
import { getClassFeedbacksPage } from './pages/class-feedbacks.js';
import { getSchoolConfigPage } from './pages/school-config.js';
import { getCommentsPage } from './pages/comments.js';
import { getAudioAnnouncementsPage } from './pages/audio-announcements.js';
import { getErrorPage } from './pages/error.js';
import { getMaintenancePage } from './pages/maintenance.js';

// Initialisation des modules
const api = new ApiModule();
const auth = new AuthModule();

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      console.log('🚀 Request received:', { path, method: request.method });
      
      // Initialiser les modules avec l'environnement
      api.init(env);
      auth.init(env);
      
      // Route: Page d'accueil du système
      if (path === '/' || path === '') {
        try {
          console.log('🏠 Route principale - vérification de session');
          const user = await auth.getUserFromSession(request);
          console.log('👤 User from session:', user ? { id: user.id, username: user.username } : null);
          
          if (user) {
            console.log('✅ User authenticated, redirecting to profile');
            return Response.redirect(url.origin + '/profile', 302);
          }
          
          console.log('❌ No user session, showing home page');
          return new Response(getHomePage(), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        } catch (error) {
          console.error('Error in main route:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      }
      
      // Route: Page de login
      if (path === '/login') {
        const user = await auth.getUserFromSession(request);
        
        if (user) {
          return Response.redirect(url.origin + '/profile', 302);
        }
        
        return new Response(getLoginPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      
      
      // Route: Page programs
      if (path === '/programs') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getProgramsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page classes
      if (path === '/classes') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getClassesPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page schools
      if (path === '/schools') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getSchoolsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page quizzes
      if (path === '/quizzes') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        return new Response(getQuizzesPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Quiz participants
      if (path.startsWith('/quizzes/') && path.endsWith('/participants')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        const quizId = path.split('/')[2];
        return new Response(getQuizParticipantsPage(user, quizId), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Quiz questions
      if (path.startsWith('/quizzes/') && path.endsWith('/questions')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        const quizId = path.split('/')[2];
        return new Response(getQuizQuestionsPage(user, quizId), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page courses
      if (path === '/courses') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        return new Response(getCoursesPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page modules
      if (path === '/modules') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        return new Response(getModulesPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page réclamations
      if (path === '/reclamations') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        return new Response(getReclamationsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page dashboard
      if (path === '/dashboard') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        return new Response(getDashboardPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page TAFs
      if (path === '/tafs') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        return new Response(getTafsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Add TAF page
      if (path === '/tafs/add') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        return new Response(getTafEditPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Edit TAF page
      if (path.startsWith('/tafs/edit/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        const tafId = path.split('/')[3];
        return new Response(getTafEditPage(user, tafId), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: TAF Feedbacks ranking
      if (path === '/tafs/feedbacks') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        return new Response(getTafFeedbacksPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Class Feedbacks page
      if (path.startsWith('/feedbacks/class/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }

        const classId = path.split('/')[3];
        if (!classId || isNaN(classId)) {
          return new Response(getErrorPage('Invalid class ID', 400), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 400
          });
        }

        return new Response(getClassFeedbacksPage(user, classId), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Course view page
      if (path.startsWith('/courses/view/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        return new Response(getCourseViewPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Add course page
      if (path === '/courses/add') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        return new Response(getCourseEditPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Edit course page
      if (path.startsWith('/courses/edit/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }
        
        const courseId = path.split('/')[3];
        return new Response(getCourseEditPage(user, courseId), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page videos
      if (path === '/videos') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getVideosPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Add video
      if (path === '/videos/add') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getVideoEditPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Edit video
      if (path.startsWith('/videos/edit/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        const videoId = path.split('/')[3];
        return new Response(getVideoEditPage(user, videoId), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page speakers
      if (path === '/speakers') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getSpeakersPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Page members
      if (path === '/members') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getMembersPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }


      // Route: Page school-fields
      if (path === '/school-fields') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getSchoolFieldsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Add member
      if (path === '/members/add') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getMemberManagePage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: View member
      if (path.startsWith('/members/view/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        const memberId = path.split('/')[3];
        return new Response(getMemberManagePage(user, memberId, 'view'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Edit member
      if (path.startsWith('/members/edit/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        const memberId = path.split('/')[3];
        return new Response(getMemberManagePage(user, memberId, 'edit'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Route: Member status management
      if (path === '/members/status') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        // Vérifier que l'utilisateur est admin
        if (user.role !== 'admin') {
          return new Response('Access denied. Admin role required.', { status: 403 });
        }
        
        const { getMemberStatusPage } = await import('./pages/member-status.js');
        return new Response(getMemberStatusPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: School Config
      if (path === '/school-config') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        // Vérifier que l'utilisateur est admin
        if (user.role !== 'admin') {
          return new Response('Access denied. Admin role required.', { status: 403 });
        }
        
        return new Response(getSchoolConfigPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Page comments
      if (path === '/comments') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getCommentsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Page audio announcements
      if (path === '/audio-announcements') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getAudioAnnouncementsPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Page support
      if (path === '/support') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getSupportPage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Page profile
      if (path === '/profile') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return Response.redirect(url.origin + '/login', 302);
        }
        
        return new Response(getProfilePage(user), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Job - Traitement automatique des feedbacks
      if (path === '/jobs/feedback/evaluation') {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Vérifier que l'utilisateur est admin
        if (user.role !== 'admin') {
          return new Response(JSON.stringify({ error: 'Access denied. Admin role required.' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return await api.processFeedbackEvaluationBatchApi(request, user);
      }
      
      
      // Routes API protégées - UTILISATION DES MODULES API + AUTH
      if (path.startsWith('/api/')) {
        const user = await auth.getUserFromSession(request);
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        console.log('🔐 API request authorized for user:', user.username);
        return await api.handleApiRequest(request, user, path);
      }
      
      
      // Route: Authentification (login)
      if (path === '/auth' && request.method === 'POST') {
        try {
          // Cloner la requête pour lire le body sans le consommer
          const clonedRequest = request.clone();
          const body = await clonedRequest.json();
          
          // Vérifier que le body contient email et password
          if (!body || typeof body !== 'object' || !body.email || !body.password) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Email and password are required'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const { email, password } = body;
          
          // Appeler la fonction de login
          const result = await auth.login({ email, password }, request);
          
          if (result.success) {
            return new Response(JSON.stringify({
              success: true,
              message: 'Login successful',
              user: result.user
            }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': result.cookie
              }
            });
          } else {
            return new Response(JSON.stringify({
              success: false,
              error: result.error || 'Invalid credentials'
            }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          console.error('🚨 Login error:', error);
          console.error('🚨 Error message:', error.message);
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid request data: ' + (error.message || 'Unknown error')
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Route: Déconnexion
      if (path === '/logout' && request.method === 'POST') {
        try {
          const result = await auth.invalidateSession(request);
          console.log('🚪 Logout successful');
          
          return new Response(JSON.stringify({
            success: true,
            message: 'Logout successful'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': result.cookie
            }
          });
        } catch (error) {
          console.error('🚨 Logout error:', error);
          return new Response(JSON.stringify({
            success: false,
            error: 'Logout failed'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Route: Page d'erreur 404
      if (path === '/404') {
        return new Response(getErrorPage('Page not found', 404), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Page de maintenance
      if (path === '/maintenance') {
        return new Response(getMaintenancePage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Route: Fichiers statiques (CSS, JS, images)
      if (path.startsWith('/styles/') || path.startsWith('/js/') || path.startsWith('/images/')) {
        try {
          // Pour les fichiers CSS
          if (path.startsWith('/styles/')) {
            const cssPath = path.replace('/styles/', 'styles/');
            const cssObject = await env.MBA_STORAGE.get(cssPath);
            
            if (cssObject) {
              const cssContent = await cssObject.text();
              return new Response(cssContent, {
                headers: { 
                  'Content-Type': 'text/css; charset=utf-8',
                  'Cache-Control': 'public, max-age=3600'
                }
              });
            }
          }
          
          // Pour les autres fichiers statiques
          const fileObject = await env.MBA_STORAGE.get(path.substring(1));
          if (fileObject) {
            const contentType = path.endsWith('.css') ? 'text/css' :
                              path.endsWith('.js') ? 'application/javascript' :
                              path.endsWith('.png') ? 'image/png' :
                              path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg' :
                              path.endsWith('.gif') ? 'image/gif' :
                              path.endsWith('.svg') ? 'image/svg+xml' :
                              'application/octet-stream';
            
            const fileContent = await fileObject.text();
            return new Response(fileContent, {
              headers: { 
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600'
              }
            });
          }
        } catch (error) {
          console.error('Error serving static file:', error);
        }
      }
      
      // Route par défaut - 404
      return new Response(getErrorPage('Page not found', 404), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        status: 404
      });
      
    } catch (error) {
      console.error('🚨 Global error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};