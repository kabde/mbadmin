// ===== PAGE MEMBER MANAGE - Admin MBA =====
// Page unifiée pour ajouter, voir et modifier les membres

import { getAdminLayout } from '../templates/layout.js';

export function getMemberManagePage(user, memberId = null, mode = 'edit') {
  const isEdit = memberId !== null;
  const isView = mode === 'view';
  
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">
          ${isEdit ? (isView ? 'Détails du Membre' : 'Modifier le Membre') : 'Ajouter un Membre'}
        </h1>
        <p class="text-muted mb-0">
          ${isEdit ? (isView ? 'Vue complète des informations du membre' : 'Modifier les informations du membre') : 'Créer un nouveau membre'}
        </p>
      </div>
      <div class="d-flex gap-2">
        <a href="/members" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Retour à la liste
        </a>
        ${isView ? `
          <a href="/members/edit/${memberId}" class="btn btn-primary">
            <i class="bi bi-pencil me-2"></i>Modifier
          </a>
        ` : ''}
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Loading Spinner -->
    <div id="loadingSpinner" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="mt-2">Chargement des informations...</p>
    </div>

    <!-- Member Form/Details -->
    <div id="memberContent" class="d-none">
      <!-- Basic Information Card -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-person-circle me-2"></i>Informations Personnelles
              </h5>
            </div>
            <div class="card-body">
              <form id="memberForm">
                <input type="hidden" id="memberId" value="${memberId || ''}">
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="memberFirstName" class="form-label fw-bold">Prénom *</label>
                      <input type="text" class="form-control" id="memberFirstName" ${isView ? 'readonly' : ''} required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="memberLastName" class="form-label fw-bold">Nom *</label>
                      <input type="text" class="form-control" id="memberLastName" ${isView ? 'readonly' : ''} required>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="memberEmail" class="form-label fw-bold">Email *</label>
                      <input type="email" class="form-control" id="memberEmail" ${isView ? 'readonly' : ''} required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="memberPhone" class="form-label fw-bold">Téléphone</label>
                      <input type="tel" class="form-control" id="memberPhone" ${isView ? 'readonly' : ''}>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="memberCity" class="form-label fw-bold">Ville</label>
                      <input type="text" class="form-control" id="memberCity" ${isView ? 'readonly' : ''}>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="memberCountry" class="form-label fw-bold">Pays</label>
                      <input type="text" class="form-control" id="memberCountry" ${isView ? 'readonly' : ''}>
                    </div>
                  </div>
                </div>
                
                ${!isView ? `
                  <div class="mb-3">
                    <label for="memberPassword" class="form-label fw-bold">Mot de passe ${isEdit ? '(laisser vide pour ne pas changer)' : '*'}</label>
                    <input type="password" class="form-control" id="memberPassword" ${isEdit ? '' : 'required'}>
                  </div>
                ` : ''}
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-info-circle me-2"></i>Informations Système
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label fw-bold">ID Membre</label>
                <div class="form-control-plaintext" id="memberIdDisplay">-</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Inscrit le</label>
                <div class="form-control-plaintext" id="memberCreatedAt">-</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Dernière connexion</label>
                <div class="form-control-plaintext" id="memberLastLogin">-</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Statut</label>
                <div class="form-control-plaintext">
                  <span class="badge" id="memberStatus">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schools and Programs -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-building me-2"></i>Écoles et Programmes
              </h5>
            </div>
            <div class="card-body">
              ${!isView ? `
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">École</label>
                  <select class="form-select" id="memberSchool">
                    <option value="">Sélectionner une école</option>
                  </select>
                  <small class="form-text text-muted">Sélectionnez l'école pour ce membre</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Rôle dans l'école</label>
                  <select class="form-select" id="memberSchoolRole">
                    <option value="student">Étudiant</option>
                    <option value="teacher">Enseignant</option>
                    <option value="admin">Administrateur</option>
                    <option value="representative">Représentant</option>
                  </select>
                </div>
              </div>
              ` : ''}
              <div id="schoolsList">
                <!-- Schools will be loaded here -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Programs and Classes Management -->
      ${!isView ? `
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-book me-2"></i>Gestion des Programmes et Classes
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Programmes</label>
                  <select class="form-select" id="memberPrograms" multiple>
                    <!-- Programs will be loaded here -->
                  </select>
                  <small class="form-text text-muted">Sélectionnez les programmes pour ce membre</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Classes</label>
                  <select class="form-select" id="memberClasses" multiple>
                    <!-- Classes will be loaded here -->
                  </select>
                  <small class="form-text text-muted">Sélectionnez les classes pour ce membre</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Custom Fields -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-gear me-2"></i>Champs Personnalisés
              </h5>
            </div>
            <div class="card-body">
              <div id="customFieldsList">
                <!-- Custom fields will be loaded here -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-tools me-2"></i>Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex">
                ${!isView ? `
                  <button class="btn btn-primary" onclick="saveMember()">
                    <i class="bi bi-check-circle me-2"></i>${isEdit ? 'Mettre à jour' : 'Créer le membre'}
                  </button>
                  ${isEdit ? `
                    <button class="btn btn-outline-warning" onclick="resetPassword()">
                      <i class="bi bi-key me-2"></i>Réinitialiser le Mot de Passe
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteMember()">
                      <i class="bi bi-trash me-2"></i>Supprimer le Membre
                    </button>
                  ` : ''}
                ` : `
                  <a href="/members/edit/${memberId}" class="btn btn-primary">
                    <i class="bi bi-pencil me-2"></i>Modifier ce Membre
                  </a>
                  <button class="btn btn-outline-warning" onclick="resetPassword()">
                    <i class="bi bi-key me-2"></i>Réinitialiser le Mot de Passe
                  </button>
                  <button class="btn btn-outline-danger" onclick="deleteMember()">
                    <i class="bi bi-trash me-2"></i>Supprimer le Membre
                  </button>
                `}
              </div>
            </div>
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
            <p>Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible et supprimera toutes ses données associées.</p>
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
    let member = null;
    let memberSchools = [];
    let memberCustomFields = [];
    let allPrograms = [];
    let allClasses = [];
    let allSchools = [];

    // Load member data on page load
    document.addEventListener('DOMContentLoaded', function() {
      if (${isEdit}) {
        loadMemberData();
      } else {
        // For new member, just show the form
        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('memberContent').classList.remove('d-none');
      }
    });

    async function loadMemberData() {
      try {
        const memberId = ${memberId || 'null'};
        
        if (!memberId) {
          showAlert('ID du membre manquant', 'danger');
          return;
        }
        
        // Load basic member info
        const memberResponse = await fetch(\`/api/members?membre_id=\${memberId}\`);
        const memberResult = await memberResponse.json();
        
        if (memberResult.success && memberResult.members.length > 0) {
          member = memberResult.members[0];
        }

        // Load member schools first
        await loadMemberSchools();
        
        // Then populate basic info (which will use the school data)
        populateBasicInfo();

        // Load custom fields
        await loadMemberCustomFields();

        // Load programs and classes for editing
        if (!${isView}) {
          await loadSchools();
          await loadProgramsAndClasses();
          
          // Pre-select school and role after all data is loaded
          if (memberSchools && memberSchools.length > 0) {
            const firstSchool = memberSchools[0];
            const schoolSelect = document.getElementById('memberSchool');
            const roleSelect = document.getElementById('memberSchoolRole');
            
            if (schoolSelect && firstSchool.school_id) {
              schoolSelect.value = firstSchool.school_id;
            }
            
            if (roleSelect && firstSchool.role) {
              roleSelect.value = firstSchool.role;
            }
          }
        }

        // Hide loading and show content
        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('memberContent').classList.remove('d-none');

      } catch (error) {
        console.error('Error loading member data:', error);
        showAlert('Erreur lors du chargement des données du membre', 'danger');
      }
    }

    function populateBasicInfo() {
      if (!member) return;

      document.getElementById('memberIdDisplay').textContent = member.id;
      document.getElementById('memberFirstName').value = member.first_name || '';
      document.getElementById('memberLastName').value = member.last_name || '';
      document.getElementById('memberEmail').value = member.email || '';
      document.getElementById('memberPhone').value = member.phone || '';
      document.getElementById('memberCity').value = member.city || '';
      document.getElementById('memberCountry').value = member.country || '';
      document.getElementById('memberCreatedAt').textContent = new Date(member.created_at).toLocaleDateString('fr-FR');
      document.getElementById('memberLastLogin').textContent = member.last_login ? new Date(member.last_login).toLocaleDateString('fr-FR') : 'Jamais';
      
      // Status badge
      const statusBadge = document.getElementById('memberStatus');
      statusBadge.textContent = member.is_active ? 'Actif' : 'Inactif';
      statusBadge.className = \`badge \${member.is_active ? 'bg-success' : 'bg-danger'}\`;
      
    }

    async function loadMemberSchools() {
      try {
        const memberId = ${memberId || 'null'};
        const response = await fetch(\`/api/member-schools?membre_id=\${memberId}\`);
        const result = await response.json();
        
        if (result.success) {
          memberSchools = result.schools;
          renderSchoolsList();
        }
      } catch (error) {
        console.error('Error loading member schools:', error);
      }
    }

    function renderSchoolsList() {
      const container = document.getElementById('schoolsList');
      container.innerHTML = '';

      if (memberSchools.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune école assignée</p>';
        return;
      }

      memberSchools.forEach(school => {
        const schoolCard = document.createElement('div');
        schoolCard.className = 'card mb-3';
        
        // Récupérer les programmes pour cette école
        const schoolPrograms = member.programs ? member.programs.split(',').map(p => p.trim()) : [];
        const programsHtml = schoolPrograms.length > 0 
          ? schoolPrograms.map(program => \`<span class="badge bg-primary me-1">\${program}</span>\`).join('')
          : '<span class="text-muted">Aucun programme</span>';
        
        // Récupérer les classes pour cette école
        const schoolClasses = member.classes ? member.classes.split(',').map(c => c.trim()) : [];
        const classesHtml = schoolClasses.length > 0 
          ? schoolClasses.map(classItem => \`<span class="badge bg-info me-1">\${classItem}</span>\`).join('')
          : '<span class="text-muted">Aucune classe</span>';
        
        schoolCard.innerHTML = \`
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-3">
                <h6 class="card-title mb-1">\${school.school_name}</h6>
                <small class="text-muted">Rôle: \${school.role}</small>
              </div>
              <div class="col-md-3">
                <div class="mb-2">
                  <strong>Programmes:</strong>
                </div>
                <div>\${programsHtml}</div>
              </div>
              <div class="col-md-3">
                <div class="mb-2">
                  <strong>Classes:</strong>
                </div>
                <div>\${classesHtml}</div>
              </div>
              <div class="col-md-1">
                <span class="badge \${school.status === 'active' ? 'bg-success' : 'bg-danger'}">\${school.status}</span>
              </div>
              <div class="col-md-2">
                <small class="text-muted">Inscrit le: \${new Date(school.enrollment_date).toLocaleDateString('fr-FR')}</small>
              </div>
            </div>
          </div>
        \`;
        container.appendChild(schoolCard);
      });
    }

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          allSchools = result.schools;
          populateSchoolSelect();
        }
      } catch (error) {
        console.error('Error loading schools:', error);
      }
    }

    function populateSchoolSelect() {
      const select = document.getElementById('memberSchool');
      if (!select) return;
      
      select.innerHTML = '<option value="">Sélectionner une école</option>';
      
      allSchools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        select.appendChild(option);
      });
    }

    async function loadMemberCustomFields() {
      try {
        // Les champs personnalisés sont déjà inclus dans les données du membre
        if (member && member.custom_fields) {
          memberCustomFields = member.custom_fields.split(',').map(field => {
            const [name, value] = field.split(':');
            return { field_name: name, field_value: value, school_name: member.school_name };
          });
        }
        renderCustomFields();
      } catch (error) {
        console.error('Error loading custom fields:', error);
      }
    }

    function renderCustomFields() {
      const container = document.getElementById('customFieldsList');
      container.innerHTML = '';

      if (memberCustomFields.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucun champ personnalisé</p>';
        return;
      }

      // Créer une grille de champs
      const fieldsGrid = document.createElement('div');
      fieldsGrid.className = 'row g-3';
      
      memberCustomFields.forEach(field => {
        const fieldCol = document.createElement('div');
        fieldCol.className = 'col-md-6 col-lg-4';
        
        // Traduire les noms de champs en français
        const fieldLabels = {
          'civilite': 'Civilité',
          'niveau_media_buying': 'Niveau Media Buying',
          'tranche_age': 'Tranche d\\'âge',
          'activite': 'Activité',
          'pays': 'Pays',
          'ville': 'Ville',
          'langue_echange': 'Langue d\\'échange',
          'ordinateur': 'Ordinateur',
          'education_level': 'Niveau d\\'éducation',
          'upp_cookie': 'UPP Cookie',
          'disponibilite': 'Disponibilité',
          'mode_formation': 'Mode de formation'
        };
        
        const fieldLabel = fieldLabels[field.field_name] || field.field_name;
        
        fieldCol.innerHTML = \`
          <div class="card border-0 bg-light h-100">
            <div class="card-body p-3">
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-tag-fill text-primary me-2"></i>
                <label class="form-label fw-bold small mb-0">\${fieldLabel}</label>
              </div>
              <div class="form-control-plaintext text-dark">
                <strong>\${field.field_value || '-'}</strong>
              </div>
            </div>
          </div>
        \`;
        fieldsGrid.appendChild(fieldCol);
      });
      
      container.appendChild(fieldsGrid);
    }

    async function loadProgramsAndClasses() {
      try {
        // Load programs
        const programsResponse = await fetch('/api/programs');
        const programsResult = await programsResponse.json();
        
        if (programsResult.success) {
          allPrograms = programsResult.programs;
          populateProgramsSelect();
        }

        // Load classes
        const classesResponse = await fetch('/api/classes');
        const classesResult = await classesResponse.json();
        
        if (classesResult.success) {
          allClasses = classesResult.classes;
          populateClassesSelect();
        }

        // Pre-select current member's programs and classes
        if (member) {
          preSelectMemberProgramsAndClasses();
        }
      } catch (error) {
        console.error('Error loading programs and classes:', error);
      }
    }

    function populateProgramsSelect() {
      const select = document.getElementById('memberPrograms');
      if (!select) return;
      
      select.innerHTML = '';
      
      allPrograms.forEach(program => {
        const option = document.createElement('option');
        option.value = program.id;
        option.textContent = program.title;
        select.appendChild(option);
      });
    }

    function populateClassesSelect() {
      const select = document.getElementById('memberClasses');
      if (!select) return;
      
      select.innerHTML = '';
      
      allClasses.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.id;
        option.textContent = classItem.title;
        select.appendChild(option);
      });
    }

    function preSelectMemberProgramsAndClasses() {
      // Pre-select programs
      const programsSelect = document.getElementById('memberPrograms');
      if (programsSelect && member.programs) {
        const memberPrograms = member.programs.split(',').map(p => p.trim());
        Array.from(programsSelect.options).forEach(option => {
          if (memberPrograms.includes(option.textContent)) {
            option.selected = true;
          }
        });
      }

      // Pre-select classes
      const classesSelect = document.getElementById('memberClasses');
      if (classesSelect && member.classes) {
        const memberClasses = member.classes.split(',').map(c => c.trim());
        Array.from(classesSelect.options).forEach(option => {
          if (memberClasses.includes(option.textContent)) {
            option.selected = true;
          }
        });
      }
    }

    async function saveMember() {
      const formData = {
        id: document.getElementById('memberId').value,
        first_name: document.getElementById('memberFirstName').value,
        last_name: document.getElementById('memberLastName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        city: document.getElementById('memberCity').value,
        country: document.getElementById('memberCountry').value,
        password: document.getElementById('memberPassword')?.value || ''
      };

      // Get selected school and role
      const schoolSelect = document.getElementById('memberSchool');
      const roleSelect = document.getElementById('memberSchoolRole');
      
      if (schoolSelect && schoolSelect.value) {
        formData.school_id = schoolSelect.value;
      }
      
      if (roleSelect) {
        formData.school_role = roleSelect.value;
      }

      // Get selected programs and classes
      const programsSelect = document.getElementById('memberPrograms');
      const classesSelect = document.getElementById('memberClasses');
      
      if (programsSelect) {
        const selectedPrograms = Array.from(programsSelect.selectedOptions).map(option => option.value);
        formData.program_ids = selectedPrograms;
      }
      
      if (classesSelect) {
        const selectedClasses = Array.from(classesSelect.selectedOptions).map(option => option.value);
        formData.class_ids = selectedClasses;
      }

      if (!formData.first_name || !formData.last_name || !formData.email) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
        return;
      }

      try {
        const url = formData.id ? \`/api/members?id=\${formData.id}\` : '/api/members';
        const method = formData.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'success');
          if (!formData.id) {
            // Redirect to the new member's page
            window.location.href = \`/members/edit/\${result.id}\`;
          }
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving member:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }

    function resetPassword() {
      if (confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de ce membre ?')) {
        showAlert('Fonctionnalité de réinitialisation de mot de passe à implémenter', 'info');
      }
    }

    function deleteMember() {
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      try {
        const memberId = ${memberId || 'null'};
        const response = await fetch(\`/api/members?id=\${memberId}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Membre supprimé avec succès', 'success');
          setTimeout(() => {
            window.location.href = '/members';
          }, 2000);
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting member:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
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
    window.saveMember = saveMember;
    window.resetPassword = resetPassword;
    window.deleteMember = deleteMember;
    window.confirmDelete = confirmDelete;
    window.showAlert = showAlert;
  `;

  return getAdminLayout(
    isEdit ? (isView ? 'Détails Membre' : 'Modifier Membre') : 'Ajouter Membre', 
    content, 
    '/members', 
    user
  ) + `<script>${scripts}</script>`;
}
