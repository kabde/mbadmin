import { getAdminLayout } from '../templates/layout.js';

export function getQuizzesPage(user) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Gestion des Quiz</h1>
          <p class="text-muted mb-0">Créez et gérez les quiz pour tester les connaissances des étudiants</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="showAddQuizModal()">
            <i class="bi bi-plus-circle me-2"></i>Nouveau Quiz
          </button>
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
                  <h6 class="card-title mb-1">Total Quiz</h6>
                  <h3 class="mb-0" id="totalQuizzes">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-question-circle fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Quiz Actifs</h6>
                  <h3 class="mb-0" id="activeQuizzes">0</h3>
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
                  <h6 class="card-title mb-1">Tentatives</h6>
                  <h3 class="mb-0" id="totalAttempts">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-people fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Score Moyen</h6>
                  <h3 class="mb-0" id="averageScore">0%</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-graph-up fs-1 opacity-75"></i>
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
              <select class="form-select" id="schoolFilter" onchange="filterQuizzes()">
                <option value="">Toutes les écoles</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="programFilter" class="form-label">Programme</label>
              <select class="form-select" id="programFilter" onchange="filterQuizzes()">
                <option value="">Tous les programmes</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="languageFilter" class="form-label">Langue</label>
              <select class="form-select" id="languageFilter" onchange="filterQuizzes()">
                <option value="">Toutes les langues</option>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="statusFilter" class="form-label">Statut</label>
              <select class="form-select" id="statusFilter" onchange="filterQuizzes()">
                <option value="">Tous les statuts</option>
                <option value="1">Actif</option>
                <option value="0">Inactif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Quizzes Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Liste des Quiz</h5>
          <button class="btn btn-outline-primary btn-sm" onclick="refreshQuizzes()">
            <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
          </button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Quiz</th>
                  <th>École / Programme</th>
                  <th>Langue</th>
                  <th>Statistiques</th>
                  <th>Statut</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody id="quizzesTableBody">
                <tr>
                  <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Quiz Modal -->
    <div class="modal fade" id="quizModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="quizModalTitle">Ajouter un Quiz</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="quizForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="quizTitle" class="form-label">Titre du Quiz *</label>
                    <input type="text" class="form-control" id="quizTitle" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="quizLanguage" class="form-label">Langue *</label>
                    <select class="form-select" id="quizLanguage" required>
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                      <option value="ar">Arabe</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="quizSchool" class="form-label">École *</label>
                    <select class="form-select" id="quizSchool" required>
                      <option value="">Sélectionner une école</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="quizProgram" class="form-label">Programme *</label>
                    <select class="form-select" id="quizProgram" required>
                      <option value="">Sélectionner un programme</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="quizDescription" class="form-label">Description</label>
                <textarea class="form-control" id="quizDescription" rows="3"></textarea>
              </div>

              <div class="mb-3">
                <label for="quizInstructions" class="form-label">Instructions</label>
                <textarea class="form-control" id="quizInstructions" rows="3"></textarea>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="quizTimeLimit" class="form-label">Limite de temps (jours)</label>
                    <input type="number" class="form-control" id="quizTimeLimit" value="14" min="1" max="365">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="quizMaxAttempts" class="form-label">Tentatives max</label>
                    <input type="number" class="form-control" id="quizMaxAttempts" value="5" min="1" max="10">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <div class="form-check mt-4">
                      <input class="form-check-input" type="checkbox" id="quizActive" checked>
                      <label class="form-check-label" for="quizActive">
                        Quiz actif
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveQuiz()">Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer la suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer ce quiz ?</p>
            <p class="text-danger"><strong>Cette action est irréversible.</strong></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" onclick="confirmDelete()">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let quizzes = [];
    let schools = [];
    let programs = [];
    let deleteQuizId = null;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadSchools();
      loadPrograms();
      loadQuizzes();
    });

    async function loadQuizzes() {
      try {
        const response = await fetch('/api/quizzes');
        const result = await response.json();
        
        if (result.success) {
          quizzes = result.quizzes;
          renderQuizzesTable();
          updateStats();
        }
      } catch (error) {
        console.error('Error loading quizzes:', error);
        showAlert('Erreur lors du chargement des quiz', 'danger');
      }
    }

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
          populateSchoolSelects();
        }
      } catch (error) {
        console.error('Error loading schools:', error);
      }
    }

    async function loadPrograms() {
      try {
        const response = await fetch('/api/programs');
        const result = await response.json();
        
        if (result.success) {
          programs = result.programs;
          populateProgramSelects();
        }
      } catch (error) {
        console.error('Error loading programs:', error);
      }
    }

    function populateSchoolSelects() {
      const selects = ['schoolFilter', 'quizSchool'];
      selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
          const currentValue = select.value;
          select.innerHTML = selectId === 'schoolFilter' ? 
            '<option value="">Toutes les écoles</option>' : 
            '<option value="">Sélectionner une école</option>';
          
          schools.forEach(school => {
            const option = document.createElement('option');
            option.value = school.id;
            option.textContent = school.name;
            select.appendChild(option);
          });
          
          if (currentValue) select.value = currentValue;
        }
      });
    }

    function populateProgramSelects() {
      const selects = ['programFilter', 'quizProgram'];
      selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
          const currentValue = select.value;
          select.innerHTML = selectId === 'programFilter' ? 
            '<option value="">Tous les programmes</option>' : 
            '<option value="">Sélectionner un programme</option>';
          
          programs.forEach(program => {
            const option = document.createElement('option');
            option.value = program.id;
            option.textContent = program.title;
            select.appendChild(option);
          });
          
          if (currentValue) select.value = currentValue;
        }
      });
    }

    function renderQuizzesTable() {
      const tbody = document.getElementById('quizzesTableBody');
      
      if (quizzes.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="6" class="text-center py-4">
              <div class="text-muted">
                <i class="bi bi-question-circle fs-1 d-block mb-2"></i>
                Aucun quiz trouvé
              </div>
            </td>
          </tr>
        \`;
        return;
      }
      
      tbody.innerHTML = quizzes.map(quiz => \`
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 me-3">
                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-question-circle text-primary"></i>
                </div>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1">\${quiz.title}</h6>
                <small class="text-muted">\${quiz.description || 'Aucune description'}</small>
              </div>
            </div>
          </td>
          <td>
            <div>
              <div class="fw-medium">\${quiz.school_name || 'N/A'}</div>
              <div class="small text-muted">\${quiz.program_name || 'N/A'}</div>
            </div>
          </td>
          <td>
            <span class="badge bg-info">\${quiz.language?.toUpperCase() || 'FR'}</span>
          </td>
          <td>
            <div class="small">
              <div><strong>\${quiz.total_attempts || 0}</strong> tentatives</div>
              <div><strong>\${quiz.completed_attempts || 0}</strong> complétées</div>
              <div>Score moyen: <strong>\${quiz.average_score ? Math.round(quiz.average_score) + '%' : 'N/A'}</strong></div>
            </div>
          </td>
          <td>
            <span class="badge \${quiz.is_active ? 'bg-success' : 'bg-secondary'}">
              \${quiz.is_active ? 'Actif' : 'Inactif'}
            </span>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="viewQuiz(\${quiz.id})" title="Voir">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-outline-info" onclick="viewParticipants(\${quiz.id})" title="Participants">
                <i class="bi bi-people"></i>
              </button>
              <button class="btn btn-outline-warning" onclick="manageQuestions(\${quiz.id})" title="Questions">
                <i class="bi bi-question-circle"></i>
              </button>
              <button class="btn btn-outline-secondary" onclick="editQuiz(\${quiz.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteQuiz(\${quiz.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function updateStats() {
      const totalQuizzes = quizzes.length;
      const activeQuizzes = quizzes.filter(q => q.is_active).length;
      const totalAttempts = quizzes.reduce((sum, q) => sum + (q.total_attempts || 0), 0);
      const avgScore = quizzes.length > 0 ? 
        Math.round(quizzes.reduce((sum, q) => sum + (q.average_score || 0), 0) / quizzes.length) : 0;
      
      document.getElementById('totalQuizzes').textContent = totalQuizzes;
      document.getElementById('activeQuizzes').textContent = activeQuizzes;
      document.getElementById('totalAttempts').textContent = totalAttempts;
      document.getElementById('averageScore').textContent = avgScore + '%';
    }

    function filterQuizzes() {
      const schoolFilter = document.getElementById('schoolFilter').value;
      const programFilter = document.getElementById('programFilter').value;
      const languageFilter = document.getElementById('languageFilter').value;
      const statusFilter = document.getElementById('statusFilter').value;
      
      let filteredQuizzes = quizzes;
      
      if (schoolFilter) {
        filteredQuizzes = filteredQuizzes.filter(q => q.school_id == schoolFilter);
      }
      if (programFilter) {
        filteredQuizzes = filteredQuizzes.filter(q => q.program_id == programFilter);
      }
      if (languageFilter) {
        filteredQuizzes = filteredQuizzes.filter(q => q.language === languageFilter);
      }
      if (statusFilter !== '') {
        filteredQuizzes = filteredQuizzes.filter(q => q.is_active == statusFilter);
      }
      
      // Temporarily replace quizzes array for rendering
      const originalQuizzes = quizzes;
      quizzes = filteredQuizzes;
      renderQuizzesTable();
      updateStats();
      quizzes = originalQuizzes;
    }

    function showAddQuizModal() {
      document.getElementById('quizModalTitle').textContent = 'Ajouter un Quiz';
      document.getElementById('quizForm').reset();
      document.getElementById('quizActive').checked = true;
      
      const modal = new bootstrap.Modal(document.getElementById('quizModal'));
      modal.show();
    }

    function editQuiz(quizId) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;
      
      document.getElementById('quizModalTitle').textContent = 'Modifier le Quiz';
      
      // Fill form
      document.getElementById('quizTitle').value = quiz.title || '';
      document.getElementById('quizDescription').value = quiz.description || '';
      document.getElementById('quizInstructions').value = quiz.instructions || '';
      document.getElementById('quizLanguage').value = quiz.language || 'fr';
      document.getElementById('quizSchool').value = quiz.school_id || '';
      document.getElementById('quizProgram').value = quiz.program_id || '';
      document.getElementById('quizTimeLimit').value = quiz.time_limit_days || 14;
      document.getElementById('quizMaxAttempts').value = quiz.max_attempts || 5;
      document.getElementById('quizActive').checked = quiz.is_active;
      
      // Store quiz ID for saving
      document.getElementById('quizForm').dataset.quizId = quizId;
      
      const modal = new bootstrap.Modal(document.getElementById('quizModal'));
      modal.show();
    }

    async function saveQuiz() {
      try {
        const form = document.getElementById('quizForm');
        const quizId = form.dataset.quizId;
        
        const data = {
          title: document.getElementById('quizTitle').value,
          description: document.getElementById('quizDescription').value,
          instructions: document.getElementById('quizInstructions').value,
          language: document.getElementById('quizLanguage').value,
          school_id: document.getElementById('quizSchool').value,
          program_id: document.getElementById('quizProgram').value,
          time_limit_days: parseInt(document.getElementById('quizTimeLimit').value),
          max_attempts: parseInt(document.getElementById('quizMaxAttempts').value),
          is_active: document.getElementById('quizActive').checked ? 1 : 0
        };
        
        const url = quizId ? \`/api/quizzes/\${quizId}\` : '/api/quizzes';
        const method = quizId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('quizModal')).hide();
          loadQuizzes();
        } else {
          showAlert(result.error || 'Erreur lors de la sauvegarde', 'danger');
        }
      } catch (error) {
        console.error('Error saving quiz:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }

    function deleteQuiz(quizId) {
      deleteQuizId = quizId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      try {
        const response = await fetch(\`/api/quizzes/\${deleteQuizId}\`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadQuizzes();
        } else {
          showAlert(result.error || 'Erreur lors de la suppression', 'danger');
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
    }

    function viewQuiz(quizId) {
      // TODO: Implement quiz view page
      showAlert('Fonctionnalité en cours de développement', 'info');
    }

    function viewParticipants(quizId) {
      window.location.href = \`/quizzes/\${quizId}/participants\`;
    }

    function manageQuestions(quizId) {
      window.location.href = \`/quizzes/\${quizId}/questions\`;
    }

    function refreshQuizzes() {
      loadQuizzes();
    }

    function showAlert(message, type) {
      const alertContainer = document.getElementById('alertContainer');
      const alertDiv = document.createElement('div');
      alertDiv.className = \`alert alert-\${type} alert-dismissible fade show\`;
      alertDiv.innerHTML = \`
        \${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      \`;
      alertContainer.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.classList.add('d-none');
      }, 5000);
    }

    // Make functions globally accessible
    window.loadQuizzes = loadQuizzes;
    window.renderQuizzesTable = renderQuizzesTable;
    window.showAddQuizModal = showAddQuizModal;
    window.editQuiz = editQuiz;
    window.saveQuiz = saveQuiz;
    window.deleteQuiz = deleteQuiz;
    window.confirmDelete = confirmDelete;
    window.viewQuiz = viewQuiz;
    window.viewParticipants = viewParticipants;
    window.manageQuestions = manageQuestions;
    window.refreshQuizzes = refreshQuizzes;
    window.filterQuizzes = filterQuizzes;
    window.showAlert = showAlert;
  `;

  return getAdminLayout('Quiz', content, '/quizzes', user) + `<script>${scripts}</script>`;
}

export function getQuizParticipantsPage(user, quizId) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Participants du Quiz</h1>
          <p class="text-muted mb-0" id="quizTitle">Chargement...</p>
        </div>
        <div>
          <button class="btn btn-outline-secondary" onclick="window.history.back()">
            <i class="bi bi-arrow-left me-2"></i>Retour
          </button>
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
                  <h6 class="card-title mb-1">Total Participants</h6>
                  <h3 class="mb-0" id="totalParticipants">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-people fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Complétés</h6>
                  <h3 class="mb-0" id="completedAttempts">0</h3>
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
                  <h6 class="card-title mb-1">En Cours</h6>
                  <h3 class="mb-0" id="inProgressAttempts">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-clock fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Score Moyen</h6>
                  <h3 class="mb-0" id="averageScore">0%</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-graph-up fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Participants Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Liste des Participants</h5>
          <button class="btn btn-outline-primary btn-sm" onclick="loadParticipants()">
            <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
          </button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Participant</th>
                  <th>Statut</th>
                  <th>Score</th>
                  <th>Débuté</th>
                  <th>Terminé</th>
                  <th>Réponses</th>
                  <th width="100">Actions</th>
                </tr>
              </thead>
              <tbody id="participantsTableBody">
                <tr>
                  <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let quiz = null;
    let participants = [];

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadQuiz();
      loadParticipants();
    });

    async function loadQuiz() {
      try {
        const response = await fetch(\`/api/quizzes/\${${quizId}}\`);
        const result = await response.json();
        
        if (result.success) {
          quiz = result.quiz;
          document.getElementById('quizTitle').textContent = quiz.title;
          document.title = \`Participants - \${quiz.title} - Admin MBA\`;
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        showAlert('Erreur lors du chargement du quiz', 'danger');
      }
    }

    async function loadParticipants() {
      try {
        const response = await fetch(\`/api/quizzes/\${${quizId}}/participants\`);
        const result = await response.json();
        
        if (result.success) {
          participants = result.participants;
          renderParticipantsTable();
          updateStats();
        }
      } catch (error) {
        console.error('Error loading participants:', error);
        showAlert('Erreur lors du chargement des participants', 'danger');
      }
    }

    function renderParticipantsTable() {
      const tbody = document.getElementById('participantsTableBody');
      
      if (participants.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="7" class="text-center py-4">
              <div class="text-muted">
                <i class="bi bi-people fs-1 d-block mb-2"></i>
                Aucun participant trouvé
              </div>
            </td>
          </tr>
        \`;
        return;
      }
      
      tbody.innerHTML = participants.map(participant => \`
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 me-3">
                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-person text-primary"></i>
                </div>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1">\${participant.first_name} \${participant.last_name}</h6>
                <small class="text-muted">\${participant.email}</small>
              </div>
            </div>
          </td>
          <td>
            <span class="badge \${getStatusBadgeClass(participant.status)}">
              \${getStatusText(participant.status)}
            </span>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="progress me-2" style="width: 60px; height: 8px;">
                <div class="progress-bar \${getScoreBarClass(participant.score, participant.total_points)}" 
                     style="width: \${getScorePercentage(participant.score, participant.total_points)}%"></div>
              </div>
              <span class="small">\${participant.score || 0}/\${participant.total_points || 0}</span>
            </div>
          </td>
          <td>
            <small>\${formatDate(participant.started_at)}</small>
          </td>
          <td>
            <small>\${participant.completed_at ? formatDate(participant.completed_at) : '-'}</small>
          </td>
          <td>
            <span class="badge bg-info">\${participant.correct_answers || 0}/\${participant.total_answers || 0}</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" onclick="viewParticipantDetails(\${participant.attempt_id})" title="Voir détails">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        </tr>
      \`).join('');
    }

    function updateStats() {
      const totalParticipants = participants.length;
      const completedAttempts = participants.filter(p => p.status === 'completed').length;
      const inProgressAttempts = participants.filter(p => p.status === 'in_progress').length;
      const avgScore = participants.length > 0 ? 
        Math.round(participants.reduce((sum, p) => sum + (p.score || 0), 0) / participants.length) : 0;
      
      document.getElementById('totalParticipants').textContent = totalParticipants;
      document.getElementById('completedAttempts').textContent = completedAttempts;
      document.getElementById('inProgressAttempts').textContent = inProgressAttempts;
      document.getElementById('averageScore').textContent = avgScore + '%';
    }

    function getStatusBadgeClass(status) {
      switch(status) {
        case 'completed': return 'bg-success';
        case 'in_progress': return 'bg-warning';
        case 'abandoned': return 'bg-danger';
        default: return 'bg-secondary';
      }
    }

    function getStatusText(status) {
      switch(status) {
        case 'completed': return 'Terminé';
        case 'in_progress': return 'En cours';
        case 'abandoned': return 'Abandonné';
        default: return 'Inconnu';
      }
    }

    function getScoreBarClass(score, total) {
      const percentage = getScorePercentage(score, total);
      if (percentage >= 80) return 'bg-success';
      if (percentage >= 60) return 'bg-warning';
      return 'bg-danger';
    }

    function getScorePercentage(score, total) {
      if (!total || total === 0) return 0;
      return Math.round((score / total) * 100);
    }

    function formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
    }

    async function viewParticipantDetails(attemptId) {
      try {
        const response = await fetch(\`/api/quiz-attempts/\${attemptId}/results\`);
        const result = await response.json();
        
        if (!result.success) {
          showAlert('Erreur lors du chargement des détails', 'danger');
          return;
        }
        
        const attempt = result.attempt;
        const answers = result.answers;
        const summary = result.summary;
        
        // Créer le modal de détails
        const modalHtml = \`
          <div class="modal fade" id="participantDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    <i class="bi bi-person-check me-2"></i>
                    Détails de la tentative - \${attempt.first_name} \${attempt.last_name}
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <!-- Résumé -->
                  <div class="row mb-4">
                    <div class="col-md-3">
                      <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                          <h4>\${summary.score}/\${summary.total_points}</h4>
                          <small>Score</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="card bg-success text-white">
                        <div class="card-body text-center">
                          <h4>\${summary.percentage}%</h4>
                          <small>Pourcentage</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="card bg-info text-white">
                        <div class="card-body text-center">
                          <h4>\${summary.correct_answers}/\${summary.total_questions}</h4>
                          <small>Bonnes réponses</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="card bg-warning text-white">
                        <div class="card-body text-center">
                          <h4>\${attempt.status === 'completed' ? 'Terminé' : 'En cours'}</h4>
                          <small>Statut</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Réponses -->
                  <h6 class="mb-3">
                    <i class="bi bi-chat-dots me-2"></i>Réponses (\${answers.length} questions)
                  </h6>
                  
                  <div class="accordion" id="answersAccordion">
                    \${answers.map((answer, index) => \`
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button \${answer.is_correct === 1 ? '' : answer.is_correct === 0 ? 'collapsed' : ''}" 
                                  type="button" data-bs-toggle="collapse" data-bs-target="#answer\${index}">
                            <div class="d-flex align-items-center w-100">
                              <span class="badge \${getAnswerBadgeClass(answer.is_correct)} me-3">
                                \${getAnswerBadgeText(answer.is_correct)}
                              </span>
                              <span class="me-3">\${answer.question_text}</span>
                              <span class="badge \${getPointsBadgeClass(answer.points_earned, answer.points)} ms-auto">
                                \${answer.points_earned || 0}/\${answer.points} pts
                              </span>
                            </div>
                          </button>
                        </h2>
                        <div id="answer\${index}" class="accordion-collapse collapse \${answer.is_correct === 1 ? 'show' : ''}">
                          <div class="accordion-body">
                            <!-- Points obtenus -->
                            <div class="row mb-3">
                              <div class="col-12">
                                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                  <div>
                                    <h6 class="mb-1">Points obtenus</h6>
                                    <small class="text-muted">\${answer.points_earned || 0} points sur \${answer.points} possibles</small>
                                  </div>
                                  <div class="text-end">
                                    <span class="badge \${getPointsBadgeClass(answer.points_earned, answer.points)} fs-6">
                                      \${answer.points_earned || 0}/\${answer.points}
                                    </span>
                                    <div class="progress mt-2" style="width: 100px; height: 8px;">
                                      <div class="progress-bar \${getPointsBadgeClass(answer.points_earned, answer.points)}" 
                                           style="width: \${Math.round(((answer.points_earned || 0) / answer.points) * 100)}%"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="row">
                              <div class="col-md-6">
                                <h6>Réponse de l'étudiant:</h6>
                                <div class="p-3 bg-light rounded">
                                  \${formatAnswer(answer)}
                                </div>
                              </div>
                              <div class="col-md-6">
                                <h6>Réponse correcte:</h6>
                                <div class="p-3 bg-light rounded">
                                  \${formatCorrectAnswer(answer)}
                                </div>
                              </div>
                            </div>
                            
                            <!-- Correction manuelle pour questions ouvertes -->
                            \${answer.is_correct === null ? \`
                              <div class="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                                <h6 class="text-warning">
                                  <i class="bi bi-pencil me-2"></i>Correction manuelle requise
                                </h6>
                                <div class="row">
                                  <div class="col-md-6">
                                    <label class="form-label">Points attribués:</label>
                                    <input type="number" class="form-control" id="points\${answer.id}" 
                                           value="\${answer.points_earned || 0}" min="0" max="\${answer.points}"
                                           onchange="validatePointsInput(\${answer.id}, \${answer.points})">
                                    <div class="form-text">Maximum: \${answer.points} points</div>
                                  </div>
                                  <div class="col-md-6">
                                    <label class="form-label">Commentaire:</label>
                                    <textarea class="form-control" id="feedback\${answer.id}" rows="2" 
                                              placeholder="Commentaire optionnel"></textarea>
                                  </div>
                                </div>
                                <button class="btn btn-warning btn-sm mt-2" onclick="saveManualCorrection(\${answer.id})">
                                  <i class="bi bi-check me-1"></i>Sauvegarder la correction
                                </button>
                              </div>
                            \` : ''}
                          </div>
                        </div>
                      </div>
                    \`).join('')}
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                  <button type="button" class="btn btn-primary" onclick="refreshParticipantDetails(\${attemptId})">
                    <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        \`;
        
        // Nettoyer les modals existants
        cleanupExistingModals();
        
        // Ajouter le nouveau modal au DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Stocker l'attemptId dans le modal pour l'actualisation
        const modalElement = document.getElementById('participantDetailsModal');
        modalElement.dataset.attemptId = attemptId;
        
        // Afficher le modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
      } catch (error) {
        console.error('Error loading participant details:', error);
        showAlert('Erreur lors du chargement des détails', 'danger');
      }
    }
    
    function getAnswerBadgeClass(isCorrect) {
      if (isCorrect === 1) return 'bg-success';
      if (isCorrect === 0) return 'bg-danger';
      return 'bg-warning';
    }
    
    function getAnswerBadgeText(isCorrect) {
      if (isCorrect === 1) return 'Correct';
      if (isCorrect === 0) return 'Incorrect';
      return 'À corriger';
    }
    
    function getPointsBadgeClass(pointsEarned, totalPoints) {
      if (pointsEarned === totalPoints) return 'bg-success';
      if (pointsEarned > 0) return 'bg-warning';
      return 'bg-danger';
    }
    
    function validatePointsInput(answerId, maxPoints) {
      const input = document.getElementById(\`points\${answerId}\`);
      const value = parseInt(input.value);
      
      if (value > maxPoints) {
        input.value = maxPoints;
        showAlert(\`Le nombre de points ne peut pas dépasser \${maxPoints}\`, 'warning');
      }
      
      if (value < 0) {
        input.value = 0;
        showAlert('Le nombre de points ne peut pas être négatif', 'warning');
      }
    }
    
    function cleanupExistingModals() {
      // Supprimer tous les modals existants
      const existingModals = document.querySelectorAll('#participantDetailsModal');
      existingModals.forEach(modal => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.dispose();
        }
        modal.remove();
      });
      
      // Supprimer les overlays Bootstrap restants
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      
      // Restaurer le scroll du body
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    function formatAnswer(answer) {
      if (answer.answer_text) {
        return \`<strong>\${answer.answer_text}</strong>\`;
      }
      if (answer.answer_number !== null) {
        return \`<strong>\${answer.answer_number}</strong>\`;
      }
      return '<em>Aucune réponse</em>';
    }
    
    function formatCorrectAnswer(answer) {
      if (answer.correct_options && answer.correct_options.length > 0) {
        const correctOptions = answer.correct_options.filter(opt => opt.is_correct === 1);
        if (correctOptions.length > 0) {
          return correctOptions.map(opt => \`<strong>\${opt.option_text}</strong>\`).join(', ');
        }
      }
      return '<em>Question ouverte - correction manuelle</em>';
    }
    
    async function saveManualCorrection(answerId) {
      const points = document.getElementById(\`points\${answerId}\`).value;
      const feedback = document.getElementById(\`feedback\${answerId}\`).value;
      
      try {
        const response = await fetch(\`/api/quiz-answers/\${answerId}/correction\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            points_awarded: parseInt(points),
            feedback: feedback
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('Correction sauvegardée avec succès', 'success');
          // Fermer le modal actuel et le supprimer
          const modalElement = document.getElementById('participantDetailsModal');
          if (modalElement) {
            const currentModal = bootstrap.Modal.getInstance(modalElement);
            if (currentModal) {
              currentModal.hide();
            }
            
            // Supprimer le modal du DOM après fermeture
            modalElement.addEventListener('hidden.bs.modal', function() {
              modalElement.remove();
              // Recharger les détails après suppression
              const attemptId = modalElement.dataset.attemptId;
              if (attemptId) {
                setTimeout(() => {
                  viewParticipantDetails(attemptId);
                }, 300);
              }
            }, { once: true });
          }
        } else {
          showAlert('Erreur lors de la sauvegarde', 'danger');
        }
      } catch (error) {
        console.error('Error saving manual correction:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }
    
    function refreshParticipantDetails(attemptId) {
      // Fermer le modal actuel proprement
      const modalElement = document.getElementById('participantDetailsModal');
      if (modalElement) {
        const currentModal = bootstrap.Modal.getInstance(modalElement);
        if (currentModal) {
          currentModal.hide();
        }
        
        // Supprimer le modal du DOM après fermeture
        modalElement.addEventListener('hidden.bs.modal', function() {
          modalElement.remove();
        }, { once: true });
      }
      
      // Recharger les détails après un court délai
      setTimeout(() => {
        viewParticipantDetails(attemptId);
      }, 500);
    }

    function showAlert(message, type) {
      const alertContainer = document.getElementById('alertContainer');
      const alertDiv = document.createElement('div');
      alertDiv.className = \`alert alert-\${type} alert-dismissible fade show\`;
      alertDiv.innerHTML = \`
        \${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      \`;
      alertContainer.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.classList.add('d-none');
      }, 5000);
    }

    // Make functions globally accessible
    window.loadParticipants = loadParticipants;
    window.viewParticipantDetails = viewParticipantDetails;
    window.saveManualCorrection = saveManualCorrection;
    window.refreshParticipantDetails = refreshParticipantDetails;
    window.validatePointsInput = validatePointsInput;
    window.cleanupExistingModals = cleanupExistingModals;
    window.showAlert = showAlert;
  `;

  return getAdminLayout('Participants du Quiz', content, '/quizzes', user) + `<script>${scripts}</script>`;
}

export function getQuizQuestionsPage(user, quizId) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Questions du Quiz</h1>
          <p class="text-muted mb-0" id="quizTitle">Chargement...</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="showAddQuestionModal()">
            <i class="bi bi-plus-circle me-2"></i>Nouvelle Question
          </button>
          <button class="btn btn-outline-secondary ms-2" onclick="window.history.back()">
            <i class="bi bi-arrow-left me-2"></i>Retour
          </button>
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
                  <h6 class="card-title mb-1">Total Questions</h6>
                  <h3 class="mb-0" id="totalQuestions">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-question-circle fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Questions Requises</h6>
                  <h3 class="mb-0" id="requiredQuestions">0</h3>
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
                  <h6 class="card-title mb-1">Points Total</h6>
                  <h3 class="mb-0" id="totalPoints">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-star fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Types de Questions</h6>
                  <h3 class="mb-0" id="questionTypes">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-list-ul fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions List -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Liste des Questions</h5>
          <button class="btn btn-outline-primary btn-sm" onclick="loadQuestions()">
            <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
          </button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th width="50">#</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Requis</th>
                  <th>Options</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody id="questionsTableBody">
                <tr>
                  <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Question Modal -->
    <div class="modal fade" id="questionModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="questionModalTitle">Ajouter une Question</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="questionForm">
              <div class="mb-3">
                <label for="questionText" class="form-label">Texte de la Question *</label>
                <textarea class="form-control" id="questionText" rows="3" required></textarea>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="questionType" class="form-label">Type de Question *</label>
                    <select class="form-select" id="questionType" required onchange="toggleOptions()">
                      <option value="">Sélectionner un type</option>
                      <option value="radio">Choix unique (Radio)</option>
                      <option value="checkbox">Choix multiple (Checkbox)</option>
                      <option value="select">Liste déroulante (Select)</option>
                      <option value="text">Texte court</option>
                      <option value="textarea">Texte long</option>
                      <option value="number">Nombre</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="questionPoints" class="form-label">Points</label>
                    <input type="number" class="form-control" id="questionPoints" value="1" min="1" max="100">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="questionOrder" class="form-label">Ordre</label>
                    <input type="number" class="form-control" id="questionOrder" value="0" min="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <div class="form-check mt-4">
                      <input class="form-check-input" type="checkbox" id="questionRequired" checked>
                      <label class="form-check-label" for="questionRequired">
                        Question requise
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3" id="placeholderField" style="display: none;">
                <label for="questionPlaceholder" class="form-label">Placeholder</label>
                <input type="text" class="form-control" id="questionPlaceholder" placeholder="Texte d'aide pour l'utilisateur">
              </div>

              <!-- Options pour questions à choix -->
              <div id="optionsSection" style="display: none;">
                <label class="form-label">Options de Réponse</label>
                <div id="optionsContainer">
                  <!-- Les options seront ajoutées dynamiquement -->
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="addOption()">
                  <i class="bi bi-plus me-1"></i>Ajouter une option
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveQuestion()">Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteQuestionModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer la suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer cette question ?</p>
            <p class="text-danger"><strong>Cette action est irréversible.</strong></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" onclick="confirmDeleteQuestion()">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let quiz = null;
    let questions = [];
    let deleteQuestionId = null;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadQuiz();
      loadQuestions();
    });

    async function loadQuiz() {
      try {
        const response = await fetch(\`/api/quizzes/\${${quizId}}\`);
        const result = await response.json();
        
        if (result.success) {
          quiz = result.quiz;
          document.getElementById('quizTitle').textContent = quiz.title;
          document.title = \`Questions - \${quiz.title} - Admin MBA\`;
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        showAlert('Erreur lors du chargement du quiz', 'danger');
      }
    }

    async function loadQuestions() {
      try {
        const response = await fetch(\`/api/quizzes/\${${quizId}}/questions\`);
        const result = await response.json();
        
        if (result.success) {
          questions = result.questions;
          renderQuestionsTable();
          updateStats();
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        showAlert('Erreur lors du chargement des questions', 'danger');
      }
    }

    function renderQuestionsTable() {
      const tbody = document.getElementById('questionsTableBody');
      
      if (questions.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="7" class="text-center py-4">
              <div class="text-muted">
                <i class="bi bi-question-circle fs-1 d-block mb-2"></i>
                Aucune question trouvée
              </div>
            </td>
          </tr>
        \`;
        return;
      }
      
      tbody.innerHTML = questions.map((question, index) => \`
        <tr>
          <td>
            <span class="badge bg-primary">\${question.order_index || index + 1}</span>
          </td>
          <td>
            <div>
              <h6 class="mb-1">\${question.question_text}</h6>
              \${question.placeholder ? \`<small class="text-muted">\${question.placeholder}</small>\` : ''}
            </div>
          </td>
          <td>
            <span class="badge \${getQuestionTypeBadgeClass(question.question_type)}">
              \${getQuestionTypeText(question.question_type)}
            </span>
          </td>
          <td>
            <span class="badge bg-info">\${question.points || 1} pts</span>
          </td>
          <td>
            <span class="badge \${question.is_required ? 'bg-success' : 'bg-secondary'}">
              \${question.is_required ? 'Oui' : 'Non'}
            </span>
          </td>
          <td>
            \${question.options ? \`<span class="badge bg-warning">\${question.options.split('||').length - 1} options</span>\` : '-'}
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editQuestion(\${question.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteQuestion(\${question.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function updateStats() {
      const totalQuestions = questions.length;
      const requiredQuestions = questions.filter(q => q.is_required).length;
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
      const questionTypes = new Set(questions.map(q => q.question_type)).size;
      
      document.getElementById('totalQuestions').textContent = totalQuestions;
      document.getElementById('requiredQuestions').textContent = requiredQuestions;
      document.getElementById('totalPoints').textContent = totalPoints;
      document.getElementById('questionTypes').textContent = questionTypes;
    }

    function getQuestionTypeBadgeClass(type) {
      switch(type) {
        case 'radio': return 'bg-primary';
        case 'checkbox': return 'bg-success';
        case 'select': return 'bg-info';
        case 'text': return 'bg-warning';
        case 'textarea': return 'bg-secondary';
        case 'number': return 'bg-dark';
        default: return 'bg-secondary';
      }
    }

    function getQuestionTypeText(type) {
      switch(type) {
        case 'radio': return 'Radio';
        case 'checkbox': return 'Checkbox';
        case 'select': return 'Select';
        case 'text': return 'Texte';
        case 'textarea': return 'Texte long';
        case 'number': return 'Nombre';
        default: return 'Inconnu';
      }
    }

    function showAddQuestionModal() {
      document.getElementById('questionModalTitle').textContent = 'Ajouter une Question';
      document.getElementById('questionForm').reset();
      document.getElementById('questionRequired').checked = true;
      document.getElementById('questionPoints').value = 1;
      document.getElementById('questionOrder').value = questions.length;
      
      // Reset options
      document.getElementById('optionsContainer').innerHTML = '';
      document.getElementById('optionsSection').style.display = 'none';
      document.getElementById('placeholderField').style.display = 'none';
      
      const modal = new bootstrap.Modal(document.getElementById('questionModal'));
      modal.show();
    }

    function editQuestion(questionId) {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;
      
      document.getElementById('questionModalTitle').textContent = 'Modifier la Question';
      
      // Fill form
      document.getElementById('questionText').value = question.question_text || '';
      document.getElementById('questionType').value = question.question_type || '';
      document.getElementById('questionPoints').value = question.points || 1;
      document.getElementById('questionOrder').value = question.order_index || 0;
      document.getElementById('questionRequired').checked = question.is_required;
      document.getElementById('questionPlaceholder').value = question.placeholder || '';
      
      // Store question ID for saving
      document.getElementById('questionForm').dataset.questionId = questionId;
      
      // Handle options and placeholder visibility
      toggleOptions();
      
      const modal = new bootstrap.Modal(document.getElementById('questionModal'));
      modal.show();
    }

    function toggleOptions() {
      const questionType = document.getElementById('questionType').value;
      const optionsSection = document.getElementById('optionsSection');
      const placeholderField = document.getElementById('placeholderField');
      
      if (questionType === 'radio' || questionType === 'checkbox' || questionType === 'select') {
        optionsSection.style.display = 'block';
        placeholderField.style.display = 'none';
        
        // Add default options if none exist
        if (document.getElementById('optionsContainer').children.length === 0) {
          addOption();
          addOption();
        }
      } else {
        optionsSection.style.display = 'none';
        placeholderField.style.display = 'block';
      }
    }

    function addOption() {
      const container = document.getElementById('optionsContainer');
      const optionIndex = container.children.length;
      
      const optionDiv = document.createElement('div');
      optionDiv.className = 'input-group mb-2';
      optionDiv.innerHTML = \`
        <input type="text" class="form-control" placeholder="Texte de l'option" name="optionText\${optionIndex}">
        <div class="input-group-text">
          <input class="form-check-input" type="checkbox" name="optionCorrect\${optionIndex}" title="Réponse correcte">
        </div>
        <button class="btn btn-outline-danger" type="button" onclick="removeOption(this)">
          <i class="bi bi-trash"></i>
        </button>
      \`;
      
      container.appendChild(optionDiv);
    }

    function removeOption(button) {
      button.parentElement.remove();
    }

    async function saveQuestion() {
      try {
        const form = document.getElementById('questionForm');
        const questionId = form.dataset.questionId;
        
        const data = {
          question_text: document.getElementById('questionText').value,
          question_type: document.getElementById('questionType').value,
          order_index: parseInt(document.getElementById('questionOrder').value),
          is_required: document.getElementById('questionRequired').checked ? 1 : 0,
          points: parseInt(document.getElementById('questionPoints').value),
          placeholder: document.getElementById('questionPlaceholder').value
        };
        
        // Collect options if applicable
        const questionType = data.question_type;
        if (questionType === 'radio' || questionType === 'checkbox' || questionType === 'select') {
          const options = [];
          const optionTexts = document.querySelectorAll('input[name^="optionText"]');
          const optionCorrects = document.querySelectorAll('input[name^="optionCorrect"]');
          
          optionTexts.forEach((input, index) => {
            if (input.value.trim()) {
              options.push({
                text: input.value.trim(),
                is_correct: optionCorrects[index] ? optionCorrects[index].checked : false,
                order: index
              });
            }
          });
          
          data.options = options;
        }
        
        const url = questionId ? \`/api/quiz-questions/\${questionId}\` : \`/api/quizzes/\${${quizId}}/questions\`;
        const method = questionId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('questionModal')).hide();
          loadQuestions();
        } else {
          showAlert(result.error || 'Erreur lors de la sauvegarde', 'danger');
        }
      } catch (error) {
        console.error('Error saving question:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }

    function deleteQuestion(questionId) {
      deleteQuestionId = questionId;
      const modal = new bootstrap.Modal(document.getElementById('deleteQuestionModal'));
      modal.show();
    }

    async function confirmDeleteQuestion() {
      try {
        const response = await fetch(\`/api/quiz-questions/\${deleteQuestionId}\`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteQuestionModal')).hide();
          loadQuestions();
        } else {
          showAlert(result.error || 'Erreur lors de la suppression', 'danger');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
    }

    function showAlert(message, type) {
      const alertContainer = document.getElementById('alertContainer');
      const alertDiv = document.createElement('div');
      alertDiv.className = \`alert alert-\${type} alert-dismissible fade show\`;
      alertDiv.innerHTML = \`
        \${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      \`;
      alertContainer.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.classList.add('d-none');
      }, 5000);
    }

    // Make functions globally accessible
    window.loadQuestions = loadQuestions;
    window.showAddQuestionModal = showAddQuestionModal;
    window.editQuestion = editQuestion;
    window.saveQuestion = saveQuestion;
    window.deleteQuestion = deleteQuestion;
    window.confirmDeleteQuestion = confirmDeleteQuestion;
    window.toggleOptions = toggleOptions;
    window.addOption = addOption;
    window.removeOption = removeOption;
    window.showAlert = showAlert;
  `;

  return getAdminLayout('Questions du Quiz', content, '/quizzes', user) + `<script>${scripts}</script>`;
}
