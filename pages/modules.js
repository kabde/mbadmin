import { getAdminLayout } from '../templates/layout.js';

export function getModulesPage(user) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Gestion des Modules</h1>
          <p class="text-muted mb-0">Créez et gérez les modules pour vos programmes de formation</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="showAddModuleModal()">
            <i class="bi bi-plus-circle me-2"></i>Nouveau Module
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
                  <h6 class="card-title mb-1">Total Modules</h6>
                  <h3 class="mb-0" id="totalModules">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-collection fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Modules Publiés</h6>
                  <h3 class="mb-0" id="publishedModules">0</h3>
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
                  <h6 class="card-title mb-1">Intervenants</h6>
                  <h3 class="mb-0" id="totalSpeakers">0</h3>
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
                  <h6 class="card-title mb-1">Programmes</h6>
                  <h3 class="mb-0" id="totalPrograms">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-mortarboard fs-1 opacity-75"></i>
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
              <select class="form-select" id="schoolFilter" onchange="filterModules()">
                <option value="">Toutes les écoles</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="programFilter" class="form-label">Programme</label>
              <select class="form-select" id="programFilter" onchange="filterModules()">
                <option value="">Tous les programmes</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="speakerFilter" class="form-label">Intervenant</label>
              <select class="form-select" id="speakerFilter" onchange="filterModules()">
                <option value="">Tous les intervenants</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="statusFilter" class="form-label">Statut</label>
              <select class="form-select" id="statusFilter" onchange="filterModules()">
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="searchInput" class="form-label">Rechercher</label>
              <input type="text" class="form-control" id="searchInput" placeholder="Rechercher par titre, description..." onkeyup="filterModules()">
            </div>
          </div>
        </div>
      </div>

      <!-- Modules Table -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Liste des Modules</h5>
            <button class="btn btn-outline-secondary btn-sm" onclick="loadModules()">
              <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Ordre</th>
                  <th>Titre</th>
                  <th>École</th>
                  <th>Programmes</th>
                  <th>Intervenants</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="modulesTableBody">
                <tr>
                  <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-2 text-muted">Chargement des modules...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Module Modal -->
    <div class="modal fade" id="addModuleModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nouveau Module</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="addModuleForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="moduleTitle" class="form-label">Titre *</label>
                    <input type="text" class="form-control" id="moduleTitle" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="moduleSchool" class="form-label">École *</label>
                    <select class="form-select" id="moduleSchool" required>
                      <option value="">Sélectionner une école</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="moduleDescription" class="form-label">Description</label>
                <textarea class="form-control" id="moduleDescription" rows="3"></textarea>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="moduleOrder" class="form-label">Ordre</label>
                    <input type="number" class="form-control" id="moduleOrder" min="0" value="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="moduleStatus" class="form-label">Statut</label>
                    <select class="form-select" id="moduleStatus">
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="modulePrograms" class="form-label">Programmes</label>
                <select class="form-select" id="modulePrograms" multiple>
                  <option value="">Sélectionner les programmes</option>
                </select>
                <div class="form-text">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs programmes</div>
              </div>
              <div class="mb-3">
                <label for="moduleSpeakers" class="form-label">Intervenants</label>
                <select class="form-select" id="moduleSpeakers" multiple>
                  <option value="">Sélectionner les intervenants</option>
                </select>
                <div class="form-text">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs intervenants</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveModule()">Créer le module</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let allModules = [];
      let filteredModules = [];

      // Load modules on page load
      document.addEventListener('DOMContentLoaded', function() {
        loadModules();
        loadFilters();
      });

      async function loadModules() {
        try {
          const response = await fetch('/api/modules');
          const data = await response.json();
          
          if (data.success) {
            allModules = data.modules || [];
            filteredModules = [...allModules];
            renderModulesTable();
            updateStats();
          } else {
            showAlert('Erreur lors du chargement des modules', 'danger');
          }
        } catch (error) {
          console.error('Error loading modules:', error);
          showAlert('Erreur lors du chargement des modules', 'danger');
        }
      }

      async function loadFilters() {
        try {
          // Load schools
          const schoolsResponse = await fetch('/api/schools');
          const schoolsData = await schoolsResponse.json();
          
          if (schoolsData.success) {
            const schoolSelect = document.getElementById('schoolFilter');
            const moduleSchoolSelect = document.getElementById('moduleSchool');
            
            schoolsData.schools.forEach(school => {
              const option1 = new Option(school.name, school.id);
              const option2 = new Option(school.name, school.id);
              schoolSelect.add(option1);
              moduleSchoolSelect.add(option2);
            });
          }

          // Load programs
          const programsResponse = await fetch('/api/programs');
          const programsData = await programsResponse.json();
          
          if (programsData.success) {
            const programSelect = document.getElementById('programFilter');
            const moduleProgramsSelect = document.getElementById('modulePrograms');
            
            programsData.programs.forEach(program => {
              const option1 = new Option(program.title, program.id);
              const option2 = new Option(program.title, program.id);
              programSelect.add(option1);
              moduleProgramsSelect.add(option2);
            });
          }

          // Load speakers
          const speakersResponse = await fetch('/api/speakers');
          const speakersData = await speakersResponse.json();
          
          if (speakersData.success) {
            const speakerSelect = document.getElementById('speakerFilter');
            const moduleSpeakersSelect = document.getElementById('moduleSpeakers');
            
            speakersData.speakers.forEach(speaker => {
              const option1 = new Option(speaker.first_name + ' ' + speaker.last_name, speaker.id);
              const option2 = new Option(speaker.first_name + ' ' + speaker.last_name, speaker.id);
              speakerSelect.add(option1);
              moduleSpeakersSelect.add(option2);
            });
          }
        } catch (error) {
          console.error('Error loading filters:', error);
        }
      }

      function renderModulesTable() {
        const tbody = document.getElementById('modulesTableBody');
        
        if (filteredModules.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Aucun module trouvé</td></tr>';
          return;
        }

        tbody.innerHTML = filteredModules.map(module => \`
          <tr>
            <td>
              <span class="badge bg-secondary">\${module.order_index || 0}</span>
            </td>
            <td>
              <div>
                <h6 class="mb-0">\${module.title}</h6>
                <small class="text-muted">\${module.description || 'Aucune description'}</small>
              </div>
            </td>
            <td>\${module.school_name || 'N/A'}</td>
            <td>
              <span class="badge bg-secondary me-1">\${module.programs || 'Aucun'}</span>
            </td>
            <td>
              <span class="badge bg-info me-1">\${module.speakers || 'Aucun'}</span>
            </td>
            <td>
              <span class="badge \${getStatusBadgeClass(module.status)}">\${getStatusText(module.status)}</span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" onclick="viewModule(\${module.id})" title="Voir">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-secondary" onclick="editModule(\${module.id})" title="Modifier">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-info" onclick="manageModuleSpeakers(\${module.id})" title="Gérer les intervenants">
                  <i class="bi bi-people"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteModule(\${module.id})" title="Supprimer">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        \`).join('');
      }

      function updateStats() {
        const totalModules = allModules.length;
        const publishedModules = allModules.filter(m => m.status === 'published').length;
        const totalSpeakers = new Set(allModules.flatMap(m => m.speakers?.split(',') || [])).size;
        const totalPrograms = new Set(allModules.flatMap(m => m.programs?.split(',') || [])).size;

        document.getElementById('totalModules').textContent = totalModules;
        document.getElementById('publishedModules').textContent = publishedModules;
        document.getElementById('totalSpeakers').textContent = totalSpeakers;
        document.getElementById('totalPrograms').textContent = totalPrograms;
      }

      function filterModules() {
        const schoolFilter = document.getElementById('schoolFilter').value;
        const programFilter = document.getElementById('programFilter').value;
        const speakerFilter = document.getElementById('speakerFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        filteredModules = allModules.filter(module => {
          return (!schoolFilter || module.school_id == schoolFilter) &&
                 (!programFilter || module.programs?.includes(programFilter)) &&
                 (!speakerFilter || module.speakers?.includes(speakerFilter)) &&
                 (!statusFilter || module.status === statusFilter) &&
                 (!searchInput || module.title.toLowerCase().includes(searchInput) ||
                  module.description?.toLowerCase().includes(searchInput) ||
                  module.speakers?.toLowerCase().includes(searchInput));
        });

        renderModulesTable();
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

      function showAddModuleModal() {
        const modal = new bootstrap.Modal(document.getElementById('addModuleModal'));
        modal.show();
      }

      async function saveModule() {
        const formData = {
          school_id: document.getElementById('moduleSchool').value,
          title: document.getElementById('moduleTitle').value,
          description: document.getElementById('moduleDescription').value,
          order_index: parseInt(document.getElementById('moduleOrder').value) || 0,
          status: document.getElementById('moduleStatus').value,
          programs: Array.from(document.getElementById('modulePrograms').selectedOptions).map(option => option.value),
          speakers: Array.from(document.getElementById('moduleSpeakers').selectedOptions).map(option => option.value)
        };

        if (!formData.school_id || !formData.title) {
          showAlert('Veuillez remplir tous les champs obligatoires', 'warning');
          return;
        }

        try {
          const response = await fetch('/api/modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          const data = await response.json();

          if (data.success) {
            showAlert('Module créé avec succès', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addModuleModal')).hide();
            document.getElementById('addModuleForm').reset();
            loadModules();
          } else {
            showAlert('Erreur lors de la création du module', 'danger');
          }
        } catch (error) {
          console.error('Error saving module:', error);
          showAlert('Erreur lors de la création du module', 'danger');
        }
      }

      function viewModule(moduleId) {
        window.location.href = \`/modules/view/\${moduleId}\`;
      }

      function editModule(moduleId) {
        window.location.href = \`/modules/edit/\${moduleId}\`;
      }

      function manageModuleSpeakers(moduleId) {
        window.location.href = \`/modules/\${moduleId}/speakers\`;
      }

      async function deleteModule(moduleId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) return;

        try {
          const response = await fetch(\`/api/modules/\${moduleId}\`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (data.success) {
            showAlert('Module supprimé avec succès', 'success');
            loadModules();
          } else {
            showAlert('Erreur lors de la suppression du module', 'danger');
          }
        } catch (error) {
          console.error('Error deleting module:', error);
          showAlert('Erreur lors de la suppression du module', 'danger');
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

  return getAdminLayout('Gestion des Modules', content, '/modules', user);
}
