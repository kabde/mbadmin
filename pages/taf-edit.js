import { getAdminLayout } from '../templates/layout.js';

export function getTafEditPage(user, tafId = null) {
  const isEdit = tafId !== null;
  const pageTitle = isEdit ? 'Modifier le TAF' : 'Nouveau TAF';
  
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">${pageTitle}</h1>
        <p class="text-muted mb-0">${isEdit ? 'Modifier les informations du TAF' : 'Créer un nouveau TAF'}</p>
      </div>
      <div class="d-flex gap-2">
        <a href="/tafs" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Retour aux TAFs
        </a>
        <button class="btn btn-primary" onclick="saveTaf()">
          <i class="bi bi-save me-2"></i>Sauvegarder
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- TAF Form -->
    <form id="tafForm">
      <input type="hidden" id="tafId" value="${tafId || ''}">
      
      <!-- Basic Information -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-info-circle me-2"></i>Informations de Base
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="inputStartDate" class="form-label">Date Début *</label>
              <input type="date" class="form-control" id="inputStartDate" required>
            </div>
            <div class="col-md-4">
              <label for="inputEndDate" class="form-label">Date Fin *</label>
              <input type="date" class="form-control" id="inputEndDate" required>
            </div>
            <div class="col-md-4">
              <label for="selectStatus" class="form-label">Statut *</label>
              <select class="form-select" id="selectStatus" required>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="selectSchool" class="form-label">École</label>
              <select class="form-select" id="selectSchool">
                <option value="">Sélectionner une école</option>
              </select>
            </div>
            <div class="col-md-12">
              <label for="selectPrograms" class="form-label">Programmes <small class="text-muted">(Vous pouvez sélectionner plusieurs programmes)</small></label>
              <select class="form-select" id="selectPrograms" multiple size="5">
              </select>
              <small class="form-text text-muted">Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs programmes</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-file-text me-2"></i>Contenu Multilingue (JSON)
          </h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="textareaContent" class="form-label">Contenu JSON *</label>
            <p class="text-muted small mb-2">Format: {"fr": {...}, "ar": {...}, "en": {...}, "es": {...}}</p>
            <textarea class="form-control font-monospace" id="textareaContent" rows="25" required></textarea>
            <small class="text-muted">Structure basée sur taf.json</small>
          </div>
        </div>
      </div>
    </form>

    <script>
      let currentTaf = null;

      // Load data on page load
      document.addEventListener('DOMContentLoaded', async function() {
        const tafId = document.getElementById('tafId').value;
        
        // Load all data first
        await loadSchools();
        await loadPrograms();
        
        // Then load TAF data if editing
        if (tafId) {
          await loadTaf(tafId);
        } else {
          // Set default JSON structure for new TAF
          const defaultContent = {
            fr: {
              title: "",
              subtitle: "",
              period: "",
              objective: {
                title: "",
                description: ""
              },
              timeline: [],
              tools: [],
              learning: {
                title: "",
                outcomes: [],
                footer: ""
              }
            }
          };
          document.getElementById('textareaContent').value = JSON.stringify(defaultContent, null, 2);
        }
      });

      async function loadSchools() {
        try {
          const response = await fetch('/api/schools');
          const data = await response.json();
          
          if (data.success && data.schools) {
            const select = document.getElementById('selectSchool');
            select.innerHTML = '<option value="">Sélectionner une école</option>';
            
            data.schools.forEach(school => {
              const option = document.createElement('option');
              option.value = school.id;
              option.textContent = school.name;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading schools:', error);
        }
      }

      async function loadPrograms() {
        try {
          const response = await fetch('/api/programs');
          const data = await response.json();
          
          if (data.success && data.programs) {
            const select = document.getElementById('selectPrograms');
            select.innerHTML = '';
            
            data.programs.forEach(program => {
              const option = document.createElement('option');
              option.value = program.id;
              option.textContent = program.title;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading programs:', error);
        }
      }

      async function loadTaf(tafId) {
        try {
          const response = await fetch('/api/tafs/' + tafId);
          const data = await response.json();
          
          if (data.success && data.taf) {
            currentTaf = data.taf;
            populateForm(data.taf);
          } else {
            showAlert('TAF non trouvé', 'danger');
          }
        } catch (error) {
          console.error('Error loading TAF:', error);
          showAlert('Erreur lors du chargement du TAF', 'danger');
        }
      }

      function populateForm(taf) {
        document.getElementById('inputStartDate').value = taf.start_date || '';
        document.getElementById('inputEndDate').value = taf.end_date || '';
        document.getElementById('selectStatus').value = taf.status || 'draft';
        document.getElementById('selectSchool').value = taf.school_id || '';
        
        // Gérer les programmes multiples
        const selectPrograms = document.getElementById('selectPrograms');
        // Réinitialiser les sélections
        Array.from(selectPrograms.options).forEach(option => {
          option.selected = false;
        });
        
        // Sélectionner les programmes associés
        if (taf.program_ids && Array.isArray(taf.program_ids)) {
          taf.program_ids.forEach(programId => {
            const option = selectPrograms.querySelector('option[value="' + programId + '"]');
            if (option) {
              option.selected = true;
            }
          });
        } else if (taf.program_id) {
          // Rétrocompatibilité avec l'ancien système (un seul programme)
          const option = selectPrograms.querySelector('option[value="' + taf.program_id + '"]');
          if (option) {
            option.selected = true;
          }
        }
        
        // Ensure content is properly formatted
        let contentToDisplay = taf.content;
        if (typeof contentToDisplay === 'string') {
          try {
            contentToDisplay = JSON.parse(contentToDisplay);
          } catch (e) {
            contentToDisplay = {};
          }
        }
        
        document.getElementById('textareaContent').value = JSON.stringify(contentToDisplay, null, 2);
      }

      async function saveTaf() {
        try {
          const tafId = document.getElementById('tafId').value;
          const isEdit = tafId !== '';

          const startDate = document.getElementById('inputStartDate').value;
          const endDate = document.getElementById('inputEndDate').value;
          const status = document.getElementById('selectStatus').value;
          const schoolId = document.getElementById('selectSchool').value || null;
          
          // Récupérer les programmes sélectionnés (multiple)
          const selectPrograms = document.getElementById('selectPrograms');
          const selectedPrograms = Array.from(selectPrograms.selectedOptions).map(option => parseInt(option.value));
          const programIds = selectedPrograms.length > 0 ? selectedPrograms : null;
          
          const contentText = document.getElementById('textareaContent').value;

          if (!startDate || !endDate || !contentText) {
            showAlert('Veuillez remplir tous les champs obligatoires (dates et contenu JSON)', 'warning');
            return;
          }

          let content;
          try {
            content = JSON.parse(contentText);
          } catch (e) {
            showAlert('JSON invalide: ' + e.message, 'danger');
            return;
          }

          const data = {
            start_date: startDate,
            end_date: endDate,
            content: content,
            status: status || 'draft',
            school_id: schoolId ? parseInt(schoolId) : null,
            program_ids: programIds // Tableau de IDs de programmes
          };

          const url = isEdit ? '/api/tafs/' + tafId : '/api/tafs';
          const method = isEdit ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (result.success) {
            showAlert(isEdit ? 'TAF modifié avec succès' : 'TAF créé avec succès', 'success');
            setTimeout(() => {
              window.location.href = '/tafs';
            }, 1500);
          } else {
            showAlert(result.error || 'Erreur lors de la sauvegarde', 'danger');
          }
        } catch (error) {
          console.error('Error saving TAF:', error);
          showAlert('Erreur lors de la sauvegarde', 'danger');
        }
      }

      function showAlert(message, type) {
        const alert = document.getElementById('alert');
        alert.className = 'alert alert-' + type;
        alert.textContent = message;
        alert.classList.remove('d-none');
        
        setTimeout(() => {
          alert.classList.add('d-none');
        }, 5000);
      }
    </script>
  `;

  return getAdminLayout(pageTitle, content, '/tafs', user);
}

