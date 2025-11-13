// ===== PAGE SCHOOL FIELDS - Admin MBA =====
// Page de gestion des définitions de champs par école

import { getAdminLayout } from '../templates/layout.js';

export function getSchoolFieldsPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Champs Personnalisés par École</h1>
        <p class="text-muted mb-0">Définir les champs personnalisés pour chaque école</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshFields()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
        <button class="btn btn-primary" onclick="showAddFieldModal()">
          <i class="bi bi-plus-circle me-2"></i>Ajouter Champ
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Filters -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <label for="searchFields" class="form-label">Rechercher</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" id="searchFields" placeholder="Nom du champ, école...">
        </div>
      </div>
      <div class="col-md-3">
        <label for="filterSchool" class="form-label">École</label>
        <select class="form-select" id="filterSchool" onchange="filterFields()">
          <option value="">Toutes les écoles</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="filterType" class="form-label">Type de champ</label>
        <select class="form-select" id="filterType" onchange="filterFields()">
          <option value="">Tous les types</option>
          <option value="text">Texte</option>
          <option value="email">Email</option>
          <option value="number">Nombre</option>
          <option value="date">Date</option>
          <option value="select">Sélection</option>
          <option value="textarea">Zone de texte</option>
          <option value="checkbox">Case à cocher</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="filterStatus" class="form-label">Statut</label>
        <select class="form-select" id="filterStatus" onchange="filterFields()">
          <option value="">Tous</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
    </div>

    <!-- Fields Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Définitions des Champs</h5>
          </div>
          <div class="col-auto">
            <span class="badge bg-primary" id="totalFields">0 champs</span>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>École</th>
                <th>Nom du Champ</th>
                <th>Libellé</th>
                <th>Type</th>
                <th>Obligatoire</th>
                <th>Ordre</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="fieldsTableBody">
              <!-- Fields will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Field Modal -->
    <div class="modal fade" id="fieldModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="fieldModalTitle">Ajouter Champ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="fieldForm">
              <input type="hidden" id="fieldId">
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="fieldSchool" class="form-label">École *</label>
                  <select class="form-select" id="fieldSchool" required>
                    <option value="">Sélectionner une école</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="fieldName" class="form-label">Nom du champ *</label>
                  <input type="text" class="form-control" id="fieldName" placeholder="ex: civilite" required>
                  <div class="form-text">Nom technique du champ (sans espaces)</div>
                </div>
              </div>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="fieldLabel" class="form-label">Libellé *</label>
                  <input type="text" class="form-control" id="fieldLabel" placeholder="ex: Civilité" required>
                </div>
                <div class="col-md-6">
                  <label for="fieldType" class="form-label">Type de champ *</label>
                  <select class="form-select" id="fieldType" required onchange="toggleFieldOptions()">
                    <option value="text">Texte</option>
                    <option value="email">Email</option>
                    <option value="number">Nombre</option>
                    <option value="date">Date</option>
                    <option value="select">Sélection</option>
                    <option value="textarea">Zone de texte</option>
                    <option value="checkbox">Case à cocher</option>
                  </select>
                </div>
              </div>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="fieldRequired" class="form-label">Champ obligatoire</label>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="fieldRequired">
                    <label class="form-check-label" for="fieldRequired">
                      Ce champ est obligatoire
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="fieldOrder" class="form-label">Ordre d'affichage</label>
                  <input type="number" class="form-control" id="fieldOrder" value="0" min="0">
                </div>
              </div>
              
              <div class="mb-3" id="fieldOptionsContainer" style="display: none;">
                <label for="fieldOptions" class="form-label">Options (une par ligne)</label>
                <textarea class="form-control" id="fieldOptions" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3"></textarea>
                <div class="form-text">Pour les champs de type "Sélection", une option par ligne</div>
              </div>
              
              <div class="mb-3">
                <label for="fieldActive" class="form-label">Statut</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="fieldActive" checked>
                  <label class="form-check-label" for="fieldActive">
                    Champ actif
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveField()">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer la Suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer cette définition de champ ? Cette action est irréversible.</p>
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
    let fields = [];
    let schools = [];
    let deleteFieldId = null;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadSchools();
      loadFields();
      setupEventListeners();
    });

    function setupEventListeners() {
      // Search functionality
      document.getElementById('searchFields').addEventListener('input', function(e) {
        filterFields();
      });

      // Filter functionality
      document.getElementById('filterSchool').addEventListener('change', function(e) {
        filterFields();
      });

      document.getElementById('filterType').addEventListener('change', function(e) {
        filterFields();
      });

      document.getElementById('filterStatus').addEventListener('change', function(e) {
        filterFields();
      });
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
        showAlert('Erreur lors du chargement des écoles', 'danger');
      }
    }

    function populateSchoolSelects() {
      const selects = ['filterSchool', 'fieldSchool'];
      selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        select.innerHTML = selectId === 'filterSchool' ? '<option value="">Toutes les écoles</option>' : '<option value="">Sélectionner une école</option>';
        
        schools.forEach(school => {
          const option = document.createElement('option');
          option.value = school.id;
          option.textContent = school.name;
          select.appendChild(option);
        });
        
        if (currentValue) {
          select.value = currentValue;
        }
      });
    }

    async function loadFields() {
      try {
        const response = await fetch('/api/school-fields');
        const result = await response.json();
        
        if (result.success) {
          fields = result.fields;
          renderFieldsTable();
          updateTotalFields(fields.length);
        }
      } catch (error) {
        console.error('Error loading fields:', error);
        showAlert('Erreur lors du chargement des champs', 'danger');
      }
    }

    function renderFieldsTable() {
      const tbody = document.getElementById('fieldsTableBody');
      tbody.innerHTML = '';

      fields.forEach(field => {
        const school = schools.find(s => s.id === field.school_id);
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>\${school ? school.name : 'Inconnue'}</td>
          <td><code>\${field.field_name}</code></td>
          <td>\${field.field_label}</td>
          <td><span class="badge bg-info">\${field.field_type}</span></td>
          <td>
            \${field.is_required ? '<span class="badge bg-danger">Oui</span>' : '<span class="badge bg-secondary">Non</span>'}
          </td>
          <td>\${field.display_order}</td>
          <td>
            \${field.is_active ? '<span class="badge bg-success">Actif</span>' : '<span class="badge bg-secondary">Inactif</span>'}
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editField(\${field.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteField(\${field.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function updateTotalFields(total) {
      document.getElementById('totalFields').textContent = \`\${total} champs\`;
    }

    function filterFields() {
      const search = document.getElementById('searchFields').value.toLowerCase();
      const schoolId = document.getElementById('filterSchool').value;
      const type = document.getElementById('filterType').value;
      const status = document.getElementById('filterStatus').value;

      let filtered = fields.filter(field => {
        const school = schools.find(s => s.id === field.school_id);
        const schoolMatch = !schoolId || field.school_id == schoolId;
        const typeMatch = !type || field.field_type === type;
        const statusMatch = !status || (status === 'active' ? field.is_active : !field.is_active);
        const searchMatch = !search || 
          field.field_name.toLowerCase().includes(search) ||
          field.field_label.toLowerCase().includes(search) ||
          (school && school.name.toLowerCase().includes(search));

        return schoolMatch && typeMatch && statusMatch && searchMatch;
      });

      // Re-render table with filtered results
      const tbody = document.getElementById('fieldsTableBody');
      tbody.innerHTML = '';

      filtered.forEach(field => {
        const school = schools.find(s => s.id === field.school_id);
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>\${school ? school.name : 'Inconnue'}</td>
          <td><code>\${field.field_name}</code></td>
          <td>\${field.field_label}</td>
          <td><span class="badge bg-info">\${field.field_type}</span></td>
          <td>
            \${field.is_required ? '<span class="badge bg-danger">Oui</span>' : '<span class="badge bg-secondary">Non</span>'}
          </td>
          <td>\${field.display_order}</td>
          <td>
            \${field.is_active ? '<span class="badge bg-success">Actif</span>' : '<span class="badge bg-secondary">Inactif</span>'}
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editField(\${field.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteField(\${field.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });

      updateTotalFields(filtered.length);
    }

    function showAddFieldModal() {
      document.getElementById('fieldModalTitle').textContent = 'Ajouter Champ';
      document.getElementById('fieldForm').reset();
      document.getElementById('fieldId').value = '';
      document.getElementById('fieldOrder').value = '0';
      document.getElementById('fieldActive').checked = true;
      toggleFieldOptions();
      
      const modal = new bootstrap.Modal(document.getElementById('fieldModal'));
      modal.show();
    }

    function editField(fieldId) {
      const field = fields.find(f => f.id === fieldId);
      if (!field) return;

      document.getElementById('fieldModalTitle').textContent = 'Modifier Champ';
      document.getElementById('fieldId').value = field.id;
      document.getElementById('fieldSchool').value = field.school_id;
      document.getElementById('fieldName').value = field.field_name;
      document.getElementById('fieldLabel').value = field.field_label;
      document.getElementById('fieldType').value = field.field_type;
      document.getElementById('fieldRequired').checked = field.is_required;
      document.getElementById('fieldOrder').value = field.display_order;
      document.getElementById('fieldActive').checked = field.is_active;
      document.getElementById('fieldOptions').value = field.field_options || '';
      
      toggleFieldOptions();
      
      const modal = new bootstrap.Modal(document.getElementById('fieldModal'));
      modal.show();
    }

    function toggleFieldOptions() {
      const fieldType = document.getElementById('fieldType').value;
      const optionsContainer = document.getElementById('fieldOptionsContainer');
      
      if (fieldType === 'select') {
        optionsContainer.style.display = 'block';
      } else {
        optionsContainer.style.display = 'none';
      }
    }

    async function saveField() {
      const formData = {
        id: document.getElementById('fieldId').value,
        school_id: document.getElementById('fieldSchool').value,
        field_name: document.getElementById('fieldName').value,
        field_label: document.getElementById('fieldLabel').value,
        field_type: document.getElementById('fieldType').value,
        is_required: document.getElementById('fieldRequired').checked,
        display_order: parseInt(document.getElementById('fieldOrder').value) || 0,
        is_active: document.getElementById('fieldActive').checked,
        field_options: document.getElementById('fieldOptions').value
      };

      if (!formData.school_id || !formData.field_name || !formData.field_label) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
        return;
      }

      try {
        const url = formData.id ? \`/api/school-fields/\${formData.id}\` : '/api/school-fields';
        const method = formData.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('fieldModal')).hide();
          loadFields();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving field:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }

    function deleteField(fieldId) {
      deleteFieldId = fieldId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      if (!deleteFieldId) return;

      try {
        const response = await fetch(\`/api/school-fields/\${deleteFieldId}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Champ supprimé avec succès', 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadFields();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting field:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
    }

    function refreshFields() {
      loadFields();
      showAlert('Champs actualisés', 'info');
    }

    function showAlert(message, type) {
      const alertDiv = document.getElementById('alert');
      alertDiv.textContent = message;
      alertDiv.className = 'alert alert-' + type;
      alertDiv.classList.remove('d-none');
      setTimeout(() => {
        alertDiv.classList.add('d-none');
      }, 5000);
    }

    // Make functions globally accessible
    window.loadFields = loadFields;
    window.renderFieldsTable = renderFieldsTable;
    window.filterFields = filterFields;
    window.deleteField = deleteField;
    window.confirmDelete = confirmDelete;
    window.refreshFields = refreshFields;
    window.showAlert = showAlert;
    window.toggleFieldOptions = toggleFieldOptions;
  `;

  return getAdminLayout('Champs École', content, '/school-fields', user) + `<script>${scripts}</script>`;
}
