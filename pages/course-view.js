import { getAdminLayout } from '../templates/layout.js';

export function getCourseViewPage(user, courseId) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Détail du Cours</h1>
          <p class="text-muted mb-0">Visualisation complète du cours</p>
        </div>
        <div>
          <button class="btn btn-outline-secondary" onclick="history.back()">
            <i class="bi bi-arrow-left me-2"></i>Retour
          </button>
        </div>
      </div>

      <!-- Alert Container -->
      <div id="alertContainer"></div>

      <!-- Course Details -->
      <div id="courseDetails">
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="mt-2 text-muted">Chargement du cours...</p>
        </div>
      </div>
    </div>

    <!-- Course Content Modal -->
    <div class="modal fade" id="courseContentModal" tabindex="-1" aria-labelledby="courseContentModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="courseContentModalLabel">Contenu du Cours</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="courseContentBody">
            <!-- Content will be loaded here -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" onclick="editCourse()">
              <i class="bi bi-pencil me-2"></i>Modifier le cours
            </button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentCourse = null;

      // Load course on page load
      document.addEventListener('DOMContentLoaded', function() {
        loadCourse();
      });

      async function loadCourse() {
        try {
          const courseId = getCourseId();
          const response = await fetch('/api/courses/' + courseId);
          const data = await response.json();
          
          if (data.success && data.course) {
            currentCourse = data.course;
            renderCourseDetails();
          } else {
            showAlert('Erreur lors du chargement du cours', 'danger');
          }
        } catch (error) {
          console.error('Error loading course:', error);
          showAlert('Erreur lors du chargement du cours', 'danger');
        }
      }

      function getCourseId() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
      }

      function renderCourseDetails() {
        if (!currentCourse) return;

        const courseDetails = document.getElementById('courseDetails');
        
        courseDetails.innerHTML = \`
          <div class="row">
            <!-- Course Info Card -->
            <div class="col-lg-8">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h2 class="card-title mb-2">\${currentCourse.title}</h2>
                      <p class="text-muted mb-3">\${currentCourse.description || 'Aucune description'}</p>
                    </div>
                    <div class="text-end">
                      <span class="badge \${getStatusBadgeClass(currentCourse.status)} fs-6">\${getStatusText(currentCourse.status)}</span>
                      <br>
                      <span class="badge \${getDifficultyBadgeClass(currentCourse.difficulty_level)} mt-2">\${getDifficultyText(currentCourse.difficulty_level)}</span>
                    </div>
                  </div>
                  
                  <div class="row mb-4">
                    <div class="col-md-3">
                      <div class="text-center">
                        <i class="bi bi-clock text-primary fs-4"></i>
                        <p class="mb-0 mt-2"><strong>Durée</strong></p>
                        <small class="text-muted">\${formatDuration(currentCourse.estimated_duration)}</small>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="text-center">
                        <i class="bi bi-translate text-primary fs-4"></i>
                        <p class="mb-0 mt-2"><strong>Langue</strong></p>
                        <small class="text-muted">\${getLanguageText(currentCourse.language)}</small>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="text-center">
                        <i class="bi bi-building text-primary fs-4"></i>
                        <p class="mb-0 mt-2"><strong>École</strong></p>
                        <small class="text-muted">\${currentCourse.school_name || 'N/A'}</small>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="text-center">
                        <i class="bi bi-star text-primary fs-4"></i>
                        <p class="mb-0 mt-2"><strong>Vedette</strong></p>
                        <small class="text-muted">\${currentCourse.is_featured ? 'Oui' : 'Non'}</small>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex gap-2 mb-4">
                    <button class="btn btn-primary" onclick="showCourseContent()">
                      <i class="bi bi-eye me-2"></i>Voir le contenu
                    </button>
                    <button class="btn btn-outline-secondary" onclick="editCourse()">
                      <i class="bi bi-pencil me-2"></i>Modifier
                    </button>
                    <button class="btn btn-outline-info" onclick="manageCourseVideos()">
                      <i class="bi bi-play-circle me-2"></i>Gérer les vidéos
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteCourse()">
                      <i class="bi bi-trash me-2"></i>Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Course Relations Card -->
            <div class="col-lg-4">
              <div class="card">
                <div class="card-header">
                  <h6 class="mb-0">Informations du cours</h6>
                </div>
                <div class="card-body">
                  <!-- Programs -->
                  <div class="mb-3">
                    <h6 class="text-muted mb-2">Programmes</h6>
                    <div id="programsList">
                      \${currentCourse.programs ? currentCourse.programs.split(',').map(program => 
                        \`<span class="badge bg-secondary me-1 mb-1">\${program.trim()}</span>\`
                      ).join('') : '<span class="text-muted">Aucun programme</span>'}
                    </div>
                  </div>

                  <!-- Speakers -->
                  <div class="mb-3">
                    <h6 class="text-muted mb-2">Formateurs</h6>
                    <div id="speakersList">
                      \${currentCourse.speakers ? currentCourse.speakers.split(',').map(speaker => 
                        \`<span class="badge bg-info me-1 mb-1">\${speaker.trim()}</span>\`
                      ).join('') : '<span class="text-muted">Aucun formateur</span>'}
                    </div>
                  </div>

                  <!-- Tags -->
                  <div class="mb-3">
                    <h6 class="text-muted mb-2">Tags</h6>
                    <div id="tagsList">
                      \${currentCourse.tags ? currentCourse.tags.split(',').map(tag => 
                        \`<span class="badge bg-primary me-1 mb-1">\${tag.trim()}</span>\`
                      ).join('') : '<span class="text-muted">Aucun tag</span>'}
                    </div>
                  </div>

                  <!-- Modules -->
                  <div class="mb-3">
                    <h6 class="text-muted mb-2">Modules</h6>
                    <div id="modulesList">
                      \${currentCourse.modules ? currentCourse.modules.split(',').map(module => 
                        \`<span class="badge bg-success me-1 mb-1">\${module.trim()}</span>\`
                      ).join('') : '<span class="text-muted">Aucun module</span>'}
                    </div>
                  </div>

                  <!-- Videos Count -->
                  <div class="mb-3">
                    <h6 class="text-muted mb-2">Vidéos</h6>
                    <div>
                      <span class="badge bg-warning">
                        \${currentCourse.video_count || 0} vidéos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        \`;
      }

      function showCourseContent() {
        if (!currentCourse) return;

        const modal = new bootstrap.Modal(document.getElementById('courseContentModal'));
        const contentBody = document.getElementById('courseContentBody');
        
        contentBody.innerHTML = \`
          <div class="course-content">
            \${currentCourse.content || '<p class="text-muted">Aucun contenu disponible</p>'}
          </div>
        \`;
        
        modal.show();
      }

      function editCourse() {
        window.location.href = \`/courses/edit/\${getCourseId()}\`;
      }

      function manageCourseVideos() {
        window.location.href = \`/courses/\${getCourseId()}/videos\`;
      }

      async function deleteCourse() {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

        try {
          const response = await fetch(\`/api/courses/\${getCourseId()}\`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (data.success) {
            showAlert('Cours supprimé avec succès', 'success');
            setTimeout(() => {
              window.location.href = '/courses';
            }, 1500);
          } else {
            showAlert('Erreur lors de la suppression du cours', 'danger');
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          showAlert('Erreur lors de la suppression du cours', 'danger');
        }
      }

      function getStatusBadgeClass(status) {
        switch(status) {
          case 'published': return 'bg-success';
          case 'draft': return 'bg-warning';
          case 'archived': return 'bg-secondary';
          default: return 'bg-secondary';
        }
      }

      function getStatusText(status) {
        switch(status) {
          case 'published': return 'Publié';
          case 'draft': return 'Brouillon';
          case 'archived': return 'Archivé';
          default: return 'Inconnu';
        }
      }

      function getDifficultyBadgeClass(difficulty) {
        switch(difficulty) {
          case 'beginner': return 'bg-success';
          case 'intermediate': return 'bg-warning';
          case 'advanced': return 'bg-danger';
          default: return 'bg-secondary';
        }
      }

      function getDifficultyText(difficulty) {
        switch(difficulty) {
          case 'beginner': return 'Débutant';
          case 'intermediate': return 'Intermédiaire';
          case 'advanced': return 'Avancé';
          default: return 'Inconnu';
        }
      }

      function getLanguageText(language) {
        switch(language) {
          case 'fr': return 'Français';
          case 'en': return 'Anglais';
          case 'ar': return 'Arabe';
          default: return 'Inconnu';
        }
      }

      function formatDuration(minutes) {
        if (!minutes) return '0h';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? \`\${hours}h\${mins > 0 ? mins + 'm' : ''}\` : \`\${mins}m\`;
      }

      function showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        alertContainer.innerHTML = \`
          <div id="\${alertId}" class="alert alert-\${type} alert-dismissible fade show" role="alert">
            \${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        \`;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          const alert = document.getElementById(alertId);
          if (alert) {
            bootstrap.Alert.getInstance(alert)?.close();
          }
        }, 5000);
      }
    </script>
  `;

  return getAdminLayout('Détail du Cours', content, '/courses', user);
}
