import { getAdminLayout } from '../templates/layout.js';

export function getCoursesPage(user) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Gestion des Cours</h1>
          <p class="text-muted mb-0">Créez et gérez les cours pour vos programmes de formation</p>
        </div>
        <div>
          <a href="/courses/add" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Nouveau Cours
          </a>
        </div>
      </div>

      <!-- Alert Container -->
      <div id="alertContainer"></div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h6 class="card-title mb-1">Total Cours</h6>
                  <h3 class="mb-0" id="totalCourses">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-book fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h6 class="card-title mb-1">Cours Publiés</h6>
                  <h3 class="mb-0" id="publishedCourses">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-check-circle fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h6 class="card-title mb-1">Vidéos Total</h6>
                  <h3 class="mb-0" id="totalVideos">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-play-circle fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h6 class="card-title mb-1">Durée Moyenne</h6>
                  <h3 class="mb-0" id="averageDuration">0h</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-clock fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label for="schoolFilter" class="form-label">École</label>
              <select class="form-select" id="schoolFilter" onchange="filterCourses()">
                <option value="">Toutes les écoles</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="programFilter" class="form-label">Programme</label>
              <select class="form-select" id="programFilter" onchange="filterCourses()">
                <option value="">Tous les programmes</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="speakerFilter" class="form-label">Formateur</label>
              <select class="form-select" id="speakerFilter" onchange="filterCourses()">
                <option value="">Tous les formateurs</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="statusFilter" class="form-label">Statut</label>
              <select class="form-select" id="statusFilter" onchange="filterCourses()">
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="difficultyFilter" class="form-label">Difficulté</label>
              <select class="form-select" id="difficultyFilter" onchange="filterCourses()">
                <option value="">Toutes les difficultés</option>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="languageFilter" class="form-label">Langue</label>
              <select class="form-select" id="languageFilter" onchange="filterCourses()">
                <option value="">Toutes les langues</option>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="searchInput" class="form-label">Rechercher</label>
              <input type="text" class="form-control" id="searchInput" placeholder="Rechercher par titre, description..." onkeyup="filterCourses()">
            </div>
          </div>
        </div>
      </div>

      <!-- Courses Table -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Liste des Cours</h5>
            <button class="btn btn-outline-secondary btn-sm" onclick="loadCourses()">
              <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>École</th>
                  <th>Module</th>
                  <th>Programmes</th>
                  <th>Formateurs</th>
                  <th>Vidéos</th>
                  <th>Statut</th>
                  <th>Difficulté</th>
                  <th>Durée</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="coursesTableBody">
                <tr>
                  <td colspan="10" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-2 text-muted">Chargement des cours...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Course Modal -->
    <div class="modal fade" id="addCourseModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nouveau Cours</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="addCourseForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="courseTitle" class="form-label">Titre *</label>
                    <input type="text" class="form-control" id="courseTitle" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="courseSchool" class="form-label">École *</label>
                    <select class="form-select" id="courseSchool" required>
                      <option value="">Sélectionner une école</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="courseDescription" class="form-label">Description</label>
                <textarea class="form-control" id="courseDescription" rows="3"></textarea>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="courseStatus" class="form-label">Statut</label>
                    <select class="form-select" id="courseStatus">
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="courseDifficulty" class="form-label">Difficulté</label>
                    <select class="form-select" id="courseDifficulty">
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="courseDuration" class="form-label">Durée (minutes)</label>
                    <input type="number" class="form-control" id="courseDuration" min="0">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="courseLanguage" class="form-label">Langue</label>
                    <select class="form-select" id="courseLanguage">
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                      <option value="ar">Arabe</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <div class="form-check mt-4">
                      <input class="form-check-input" type="checkbox" id="courseFeatured">
                      <label class="form-check-label" for="courseFeatured">
                        Cours en vedette
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveCourse()">Créer le cours</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let allCourses = [];
      let filteredCourses = [];

      // Load courses on page load
      document.addEventListener('DOMContentLoaded', function() {
        loadCourses();
        loadFilters();
      });

      async function loadCourses() {
        try {
          const response = await fetch('/api/courses');
          const data = await response.json();
          
          if (data.success) {
            allCourses = data.courses || [];
            filteredCourses = [...allCourses];
            renderCoursesTable();
            updateStats();
          } else {
            showAlert('Erreur lors du chargement des cours', 'danger');
          }
        } catch (error) {
          console.error('Error loading courses:', error);
          showAlert('Erreur lors du chargement des cours', 'danger');
        }
      }

      async function loadFilters() {
        try {
          // Load schools
          const schoolsResponse = await fetch('/api/schools');
          const schoolsData = await schoolsResponse.json();
          
          if (schoolsData.success) {
            const schoolSelect = document.getElementById('schoolFilter');
            const courseSchoolSelect = document.getElementById('courseSchool');
            
            schoolsData.schools.forEach(school => {
              const option1 = new Option(school.name, school.id);
              const option2 = new Option(school.name, school.id);
              schoolSelect.add(option1);
              courseSchoolSelect.add(option2);
            });
          }

          // Load programs
          const programsResponse = await fetch('/api/programs');
          const programsData = await programsResponse.json();
          
          if (programsData.success) {
            const programSelect = document.getElementById('programFilter');
            programsData.programs.forEach(program => {
              const option = new Option(program.title, program.id);
              programSelect.add(option);
            });
          }

          // Load speakers
          const speakersResponse = await fetch('/api/speakers');
          const speakersData = await speakersResponse.json();
          
          if (speakersData.success) {
            const speakerSelect = document.getElementById('speakerFilter');
            speakersData.speakers.forEach(speaker => {
              const option = new Option(speaker.first_name + ' ' + speaker.last_name, speaker.id);
              speakerSelect.add(option);
            });
          }
        } catch (error) {
          console.error('Error loading filters:', error);
        }
      }

      function renderCoursesTable() {
        const tbody = document.getElementById('coursesTableBody');
        
        if (filteredCourses.length === 0) {
          tbody.innerHTML = '<tr><td colspan="10" class="text-center py-4 text-muted">Aucun cours trouvé</td></tr>';
          return;
        }

        tbody.innerHTML = filteredCourses.map(course => \`
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <div class="me-3">
                  <img src="\${course.thumbnail_url || '/placeholder-course.jpg'}" 
                       class="rounded" width="40" height="40" 
                       style="object-fit: cover;" alt="Thumbnail">
                </div>
                <div>
                  <h6 class="mb-0">\${course.title}</h6>
                </div>
              </div>
            </td>
            <td>\${course.school_name || 'N/A'}</td>
            <td>
              <span class="badge bg-warning me-1">\${course.modules || 'Aucun'}</span>
            </td>
            <td>
              <span class="badge bg-secondary me-1">\${course.programs || 'Aucun'}</span>
            </td>
            <td>
              <span class="badge bg-info me-1">\${course.speakers || 'Aucun'}</span>
            </td>
            <td>
              <span class="badge bg-primary">\${course.video_count || 0} vidéos</span>
            </td>
            <td>
              <span class="badge \${getStatusBadgeClass(course.status)}">\${getStatusText(course.status)}</span>
            </td>
            <td>
              <span class="badge \${getDifficultyBadgeClass(course.difficulty_level)}">\${getDifficultyText(course.difficulty_level)}</span>
            </td>
            <td>
              <span class="text-muted">\${formatDuration(course.total_duration || course.estimated_duration)}</span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" onclick="viewCourse(\${course.id})" title="Voir">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-secondary" onclick="editCourse(\${course.id})" title="Modifier">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-info" onclick="manageCourseVideos(\${course.id})" title="Gérer les vidéos">
                  <i class="bi bi-play-circle"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteCourse(\${course.id})" title="Supprimer">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        \`).join('');
      }

      function updateStats() {
        const totalCourses = allCourses.length;
        const publishedCourses = allCourses.filter(c => c.status === 'published').length;
        const totalVideos = allCourses.reduce((sum, c) => sum + (c.video_count || 0), 0);
        const averageDuration = allCourses.length > 0 ? 
          Math.round(allCourses.reduce((sum, c) => sum + (c.total_duration || c.estimated_duration || 0), 0) / allCourses.length) : 0;

        document.getElementById('totalCourses').textContent = totalCourses;
        document.getElementById('publishedCourses').textContent = publishedCourses;
        document.getElementById('totalVideos').textContent = totalVideos;
        document.getElementById('averageDuration').textContent = formatDuration(averageDuration);
      }

      function filterCourses() {
        const schoolFilter = document.getElementById('schoolFilter').value;
        const programFilter = document.getElementById('programFilter').value;
        const speakerFilter = document.getElementById('speakerFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const difficultyFilter = document.getElementById('difficultyFilter').value;
        const languageFilter = document.getElementById('languageFilter').value;
        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        filteredCourses = allCourses.filter(course => {
          return (!schoolFilter || course.school_id == schoolFilter) &&
                 (!programFilter || course.programs?.includes(programFilter)) &&
                 (!speakerFilter || course.speakers?.includes(speakerFilter)) &&
                 (!statusFilter || course.status === statusFilter) &&
                 (!difficultyFilter || course.difficulty_level === difficultyFilter) &&
                 (!languageFilter || course.language === languageFilter) &&
                 (!searchInput || course.title.toLowerCase().includes(searchInput) ||
                  course.description?.toLowerCase().includes(searchInput) ||
                  course.speakers?.toLowerCase().includes(searchInput));
        });

        renderCoursesTable();
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

      function formatDuration(minutes) {
        if (!minutes) return '0h';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? \`\${hours}h\${mins > 0 ? mins + 'm' : ''}\` : \`\${mins}m\`;
      }

      function showAddCourseModal() {
        const modal = new bootstrap.Modal(document.getElementById('addCourseModal'));
        modal.show();
      }

      async function saveCourse() {
        const formData = {
          school_id: document.getElementById('courseSchool').value,
          title: document.getElementById('courseTitle').value,
          description: document.getElementById('courseDescription').value,
          status: document.getElementById('courseStatus').value,
          difficulty_level: document.getElementById('courseDifficulty').value,
          estimated_duration: parseInt(document.getElementById('courseDuration').value) || 0,
          language: document.getElementById('courseLanguage').value,
          is_featured: document.getElementById('courseFeatured').checked
        };

        if (!formData.school_id || !formData.title) {
          showAlert('Veuillez remplir tous les champs obligatoires', 'warning');
          return;
        }

        try {
          const response = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          const data = await response.json();

          if (data.success) {
            showAlert('Cours créé avec succès', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();
            document.getElementById('addCourseForm').reset();
            loadCourses();
          } else {
            showAlert('Erreur lors de la création du cours', 'danger');
          }
        } catch (error) {
          console.error('Error saving course:', error);
          showAlert('Erreur lors de la création du cours', 'danger');
        }
      }

      function viewCourse(courseId) {
        window.location.href = \`/courses/view/\${courseId}\`;
      }

      function editCourse(courseId) {
        window.location.href = \`/courses/edit/\${courseId}\`;
      }

      function manageCourseVideos(courseId) {
        window.location.href = \`/courses/\${courseId}/videos\`;
      }

      async function deleteCourse(courseId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

        try {
          const response = await fetch(\`/api/courses/\${courseId}\`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (data.success) {
            showAlert('Cours supprimé avec succès', 'success');
            loadCourses();
          } else {
            showAlert('Erreur lors de la suppression du cours', 'danger');
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          showAlert('Erreur lors de la suppression du cours', 'danger');
        }
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

  return getAdminLayout('Gestion des Cours', content, '/courses', user);
}
