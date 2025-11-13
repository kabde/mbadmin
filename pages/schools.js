import { getAdminLayout } from '../templates/layout.js';

export function getSchoolsPage(user) {
  const content = `
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">Gestion des Écoles</h1>
        <p class="text-muted mb-0">Gérez les écoles, leurs administrateurs et leurs paramètres</p>
      </div>
      <div>
        <button class="btn btn-primary" onclick="showAddSchoolModal()">
          <i class="bi bi-plus-circle me-2"></i>Ajouter une École
        </button>
        <button class="btn btn-outline-secondary ms-2" onclick="refreshSchools()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alertContainer"></div>

    <!-- Schools Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Liste des Écoles</h5>
          </div>
          <div class="col-auto">
            <span class="badge bg-primary" id="totalSchools">0 écoles</span>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>École</th>
                <th>Contact</th>
                <th>Analytics</th>
                <th>Statistiques</th>
                <th>Statut</th>
                <th width="120">Actions</th>
              </tr>
            </thead>
            <tbody id="schoolsTableBody">
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

    <!-- Add/Edit School Modal -->
    <div class="modal fade" id="schoolModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="schoolModalTitle">Ajouter une École</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="schoolForm">
              <div class="row">
                <!-- Informations de base -->
                <div class="col-md-6">
                  <h6 class="text-primary mb-3">Informations de Base</h6>
                  
                  <div class="mb-3">
                    <label for="schoolName" class="form-label">Nom de l'école *</label>
                    <input type="text" class="form-control" id="schoolName" required>
                  </div>
                  
                  <div class="mb-3">
                    <label for="schoolSlug" class="form-label">Slug (URL)</label>
                    <input type="text" class="form-control" id="schoolSlug" placeholder="ex: mba">
                  </div>
                  
                  <div class="mb-3">
                    <label for="schoolLogo" class="form-label">URL du Logo</label>
                    <input type="url" class="form-control" id="schoolLogo" placeholder="https://example.com/logo.png">
                  </div>
                  
                  <div class="mb-3">
                    <label for="schoolDescription" class="form-label">Description</label>
                    <textarea class="form-control" id="schoolDescription" rows="3"></textarea>
                  </div>
                  
                  <div class="mb-3">
                    <label for="schoolWebsite" class="form-label">Site Web</label>
                    <input type="url" class="form-control" id="schoolWebsite" placeholder="https://example.com">
                  </div>
                </div>

                <!-- Contact & Localisation -->
                <div class="col-md-6">
                  <h6 class="text-primary mb-3">Contact & Localisation</h6>
                  
                  <div class="mb-3">
                    <label for="contactEmail" class="form-label">Email de Contact</label>
                    <input type="email" class="form-control" id="contactEmail">
                  </div>
                  
                  <div class="mb-3">
                    <label for="contactPhone" class="form-label">Téléphone</label>
                    <input type="tel" class="form-control" id="contactPhone">
                  </div>
                  
                  <div class="mb-3">
                    <label for="schoolAddress" class="form-label">Adresse</label>
                    <textarea class="form-control" id="schoolAddress" rows="2"></textarea>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="schoolCity" class="form-label">Ville</label>
                        <input type="text" class="form-control" id="schoolCity">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="schoolCountry" class="form-label">Pays</label>
                        <input type="text" class="form-control" id="schoolCountry">
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="postalCode" class="form-label">Code Postal</label>
                        <input type="text" class="form-control" id="postalCode">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="schoolTimezone" class="form-label">Fuseau Horaire</label>
                        <select class="form-select" id="schoolTimezone">
                          <option value="UTC">UTC</option>
                          <option value="Europe/Paris">Europe/Paris</option>
                          <option value="America/New_York">America/New_York</option>
                          <option value="Africa/Casablanca">Africa/Casablanca</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr>

              <div class="row">
                <!-- Analytics -->
                <div class="col-md-6">
                  <h6 class="text-primary mb-3">Analytics & Tracking</h6>
                  
                  <div class="mb-3">
                    <label for="facebookPixel" class="form-label">Facebook Pixel ID</label>
                    <input type="text" class="form-control" id="facebookPixel" placeholder="123456789012345">
                  </div>
                  
                  <div class="mb-3">
                    <label for="googleAnalytics" class="form-label">Google Analytics ID</label>
                    <input type="text" class="form-control" id="googleAnalytics" placeholder="G-XXXXXXXXXX">
                  </div>
                  
                  <div class="mb-3">
                    <label for="googleTagManager" class="form-label">Google Tag Manager ID</label>
                    <input type="text" class="form-control" id="googleTagManager" placeholder="GTM-XXXXXXX">
                  </div>
                </div>

                <!-- Configuration -->
                <div class="col-md-6">
                  <h6 class="text-primary mb-3">Configuration</h6>
                  
                  <div class="mb-3">
                    <label for="schoolCurrency" class="form-label">Devise</label>
                    <select class="form-select" id="schoolCurrency">
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar US)</option>
                      <option value="MAD">MAD (Dirham Marocain)</option>
                      <option value="CAD">CAD (Dollar Canadien)</option>
                    </select>
                  </div>
                  
                  <div class="mb-3">
                    <label for="schoolLanguage" class="form-label">Langue</label>
                    <select class="form-select" id="schoolLanguage">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  
                  <div class="mb-3">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="schoolActive" checked>
                      <label class="form-check-label" for="schoolActive">
                        École active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveSchool()">Enregistrer</button>
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
            <p>Êtes-vous sûr de vouloir supprimer cette école ?</p>
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
    let schools = [];
    let deleteSchoolId = null;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM Content Loaded - Starting to load schools');
      
      // Test simple pour vérifier que le JavaScript fonctionne
      setTimeout(() => {
        console.log('JavaScript is working - 3 seconds after load');
        const tbody = document.getElementById('schoolsTableBody');
        if (tbody) {
          console.log('Table body found:', tbody);
        } else {
          console.error('Table body not found!');
        }
      }, 3000);
      
      loadSchools();
    });

    async function loadSchools() {
      try {
        console.log('Loading schools...');
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        console.log('API Response:', result);
        
        if (result.success) {
          schools = result.schools;
          console.log('Schools loaded:', schools.length, 'schools');
          renderSchoolsTable();
          updateTotalSchools();
        } else {
          console.error('API Error:', result.error);
          showAlert('Erreur API: ' + result.error, 'danger');
        }
      } catch (error) {
        console.error('Error loading schools:', error);
        showAlert('Erreur lors du chargement des écoles', 'danger');
      }
    }

    function renderSchoolsTable() {
      console.log('Rendering schools table with', schools.length, 'schools');
      const tbody = document.getElementById('schoolsTableBody');
      
      if (schools.length === 0) {
        console.log('No schools to display');
        tbody.innerHTML = \`
          <tr>
            <td colspan="6" class="text-center py-4">
              <div class="text-muted">
                <i class="bi bi-school fs-1 d-block mb-2"></i>
                Aucune école trouvée
              </div>
            </td>
          </tr>
        \`;
        return;
      }
      
      tbody.innerHTML = schools.map(school => \`
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <div class="me-3">
                \${school.logo_url ? 
                  \`<img src="\${school.logo_url}" alt="Logo" class="rounded" style="width: 40px; height: 40px; object-fit: cover;">\` : 
                  \`<div class="bg-primary text-white rounded d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-school"></i>
                  </div>\`
                }
              </div>
              <div>
                <div class="fw-semibold">\${school.name}</div>
                <small class="text-muted">\${school.slug || 'Aucun slug'}</small>
              </div>
            </div>
          </td>
          <td>
            <div>
              <div class="small">\${school.contact_email || 'Aucun email'}</div>
              <div class="small text-muted">\${school.contact_phone || 'Aucun telephone'}</div>
            </div>
          </td>
          <td>
            <div class="small">
              \${school.facebook_pixel_id ? \`<span class="badge bg-primary me-1">FB</span>\` : ''}
              \${school.google_analytics_id ? \`<span class="badge bg-success me-1">GA</span>\` : ''}
              \${school.google_tag_manager_id ? \`<span class="badge bg-info">GTM</span>\` : ''}
              \${!school.facebook_pixel_id && !school.google_analytics_id && !school.google_tag_manager_id ? 
                \`<span class="text-muted">Aucun</span>\` : ''}
            </div>
          </td>
          <td>
            <div class="small">
              <div>\${school.admin_count || 0} admins</div>
              <div>\${school.member_count || 0} membres</div>
              <div>\${school.class_count || 0} classes</div>
              <div>\${school.program_count || 0} programmes</div>
            </div>
          </td>
          <td>
            <span class="badge \${school.is_active ? 'bg-success' : 'bg-secondary'}">
              \${school.is_active ? 'Actif' : 'Inactif'}
            </span>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editSchool(\${school.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-info" onclick="manageAdmins(\${school.id})" title="Gérer les Admins">
                <i class="bi bi-people"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteSchool(\${school.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function updateTotalSchools() {
      console.log('Updating total schools:', schools.length);
      document.getElementById('totalSchools').textContent = \`\${schools.length} ecole\${schools.length > 1 ? 's' : ''}\`;
    }

    function showAddSchoolModal() {
      document.getElementById('schoolModalTitle').textContent = 'Ajouter une Ecole';
      document.getElementById('schoolForm').reset();
      document.getElementById('schoolActive').checked = true;
      
      const modal = new bootstrap.Modal(document.getElementById('schoolModal'));
      modal.show();
    }

    function editSchool(schoolId) {
      const school = schools.find(s => s.id === schoolId);
      if (!school) return;
      
      document.getElementById('schoolModalTitle').textContent = 'Modifier l\\'Ecole';
      
      // Remplir le formulaire
      document.getElementById('schoolName').value = school.name || '';
      document.getElementById('schoolSlug').value = school.slug || '';
      document.getElementById('schoolLogo').value = school.logo_url || '';
      document.getElementById('schoolDescription').value = school.description || '';
      document.getElementById('schoolWebsite').value = school.website_url || '';
      document.getElementById('contactEmail').value = school.contact_email || '';
      document.getElementById('contactPhone').value = school.contact_phone || '';
      document.getElementById('schoolAddress').value = school.address || '';
      document.getElementById('schoolCity').value = school.city || '';
      document.getElementById('schoolCountry').value = school.country || '';
      document.getElementById('postalCode').value = school.postal_code || '';
      document.getElementById('schoolTimezone').value = school.timezone || 'UTC';
      document.getElementById('facebookPixel').value = school.facebook_pixel_id || '';
      document.getElementById('googleAnalytics').value = school.google_analytics_id || '';
      document.getElementById('googleTagManager').value = school.google_tag_manager_id || '';
      document.getElementById('schoolCurrency').value = school.currency || 'EUR';
      document.getElementById('schoolLanguage').value = school.language || 'fr';
      document.getElementById('schoolActive').checked = school.is_active;
      
      // Stocker l'ID pour la sauvegarde
      document.getElementById('schoolForm').dataset.schoolId = schoolId;
      
      const modal = new bootstrap.Modal(document.getElementById('schoolModal'));
      modal.show();
    }

    async function saveSchool() {
      try {
        const form = document.getElementById('schoolForm');
        const schoolId = form.dataset.schoolId;
        
        const data = {
          name: document.getElementById('schoolName').value,
          slug: document.getElementById('schoolSlug').value,
          logo_url: document.getElementById('schoolLogo').value,
          description: document.getElementById('schoolDescription').value,
          website_url: document.getElementById('schoolWebsite').value,
          contact_email: document.getElementById('contactEmail').value,
          contact_phone: document.getElementById('contactPhone').value,
          address: document.getElementById('schoolAddress').value,
          city: document.getElementById('schoolCity').value,
          country: document.getElementById('schoolCountry').value,
          postal_code: document.getElementById('postalCode').value,
          timezone: document.getElementById('schoolTimezone').value,
          facebook_pixel_id: document.getElementById('facebookPixel').value,
          google_analytics_id: document.getElementById('googleAnalytics').value,
          google_tag_manager_id: document.getElementById('googleTagManager').value,
          currency: document.getElementById('schoolCurrency').value,
          language: document.getElementById('schoolLanguage').value,
          is_active: document.getElementById('schoolActive').checked ? 1 : 0
        };
        
        console.log('Form data:', data);
        console.log('School ID:', schoolId);
        
        const url = schoolId ? \`/api/schools/\${schoolId}\` : '/api/schools';
        const method = schoolId ? 'PUT' : 'POST';
        
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
          bootstrap.Modal.getInstance(document.getElementById('schoolModal')).hide();
          loadSchools();
        } else {
          showAlert(result.error || 'Erreur lors de la sauvegarde', 'danger');
        }
      } catch (error) {
        console.error('Error saving school:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }

    function deleteSchool(schoolId) {
      deleteSchoolId = schoolId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      try {
        const response = await fetch(\`/api/schools/\${deleteSchoolId}\`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadSchools();
        } else {
          showAlert(result.error || 'Erreur lors de la suppression', 'danger');
        }
      } catch (error) {
        console.error('Error deleting school:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
    }

    function manageAdmins(schoolId) {
      // Redirection vers la gestion des administrateurs
      window.location.href = \`/schools/\${schoolId}/admins\`;
    }

    function refreshSchools() {
      loadSchools();
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
    window.loadSchools = loadSchools;
    window.renderSchoolsTable = renderSchoolsTable;
    window.showAddSchoolModal = showAddSchoolModal;
    window.editSchool = editSchool;
    window.saveSchool = saveSchool;
    window.deleteSchool = deleteSchool;
    window.confirmDelete = confirmDelete;
    window.manageAdmins = manageAdmins;
    window.refreshSchools = refreshSchools;
    window.showAlert = showAlert;
  `;

  return getAdminLayout('Écoles', content, '/schools', user) + `<script>${scripts}</script>`;
}
