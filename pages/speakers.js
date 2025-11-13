// ===== PAGE SPEAKERS - Admin MBA =====
// Gestion des formateurs par école

import { getAdminLayout } from '../templates/layout.js';

export function getSpeakersPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Gestion des Formateurs</h1>
        <p class="text-muted mb-0">Gérer les formateurs par école</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshSpeakers()">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
        <button class="btn btn-primary" onclick="showAddSpeakerModal()">
          <i class="bi bi-plus-circle me-2"></i>Ajouter Formateur
        </button>
      </div>
    </div>

    <!-- Alert Container -->
    <div id="alert"></div>

    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-md-4">
        <label for="searchSpeakers" class="form-label">Rechercher</label>
        <input type="text" class="form-control" id="searchSpeakers" placeholder="Nom, prénom, position...">
      </div>
      <div class="col-md-3">
        <label for="filterSchool" class="form-label">École</label>
        <select class="form-select" id="filterSchool">
          <option value="">Toutes les écoles</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="filterPosition" class="form-label">Position</label>
        <select class="form-select" id="filterPosition">
          <option value="">Toutes les positions</option>
        </select>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-outline-secondary w-100" onclick="clearFilters()">
          <i class="bi bi-x-circle me-1"></i>Effacer
        </button>
      </div>
    </div>

    <!-- Speakers Table -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>École</th>
                <th>Position</th>
                <th>LinkedIn</th>
                <th>Créé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="speakersTableBody">
              <!-- Speakers will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Speaker Modal -->
    <div class="modal fade" id="speakerModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="speakerModalTitle">Ajouter Formateur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="speakerForm">
              <input type="hidden" id="speakerId">
              
              <div class="row">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">Prénom *</label>
                  <input type="text" class="form-control" id="firstName" required>
                </div>
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Nom *</label>
                  <input type="text" class="form-control" id="lastName" required>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-md-6">
                  <label for="speakerSchool" class="form-label">École *</label>
                  <select class="form-select" id="speakerSchool" required>
                    <option value="">Sélectionner une école</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="position" class="form-label">Position</label>
                  <input type="text" class="form-control" id="position" placeholder="Directeur, Professeur...">
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-md-6">
                  <label for="photoUpload" class="form-label">Photo du formateur</label>
                  <div class="upload-container">
                    <input type="file" class="form-control" id="photoUpload" accept="image/*" onchange="handlePhotoUpload(event)">
                    <div class="upload-preview mt-2" id="photoPreview" style="display: none;">
                      <img id="previewImage" src="" alt="Preview" class="img-thumbnail" style="max-width: 150px; max-height: 150px;">
                      <div class="mt-2">
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removePhoto()">Supprimer</button>
                      </div>
                    </div>
                    <div class="upload-progress mt-2" id="uploadProgress" style="display: none;">
                      <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                      </div>
                      <small class="text-muted">Upload en cours...</small>
                    </div>
                  </div>
                  <div class="mt-2">
                    <label for="photoUrl" class="form-label">Ou URL de photo</label>
                    <input type="url" class="form-control" id="photoUrl" placeholder="https://example.com/photo.jpg">
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="linkedinUrl" class="form-label">LinkedIn URL</label>
                  <input type="url" class="form-control" id="linkedinUrl" placeholder="https://linkedin.com/in/johndoe">
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-12">
                  <label for="bio" class="form-label">Biographie</label>
                  <textarea class="form-control" id="bio" rows="3" placeholder="Description du formateur..."></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveSpeaker()">Enregistrer</button>
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
            <p>Êtes-vous sûr de vouloir supprimer ce formateur ?</p>
            <p class="text-muted">Cette action est irréversible.</p>
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
    let speakers = [];
    let schools = [];
    let deleteSpeakerId = null;

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🚀 Speakers page loaded');
      loadSchools();
      loadSpeakers();
      setupEventListeners();
    });

    function setupEventListeners() {
      // Search functionality
      document.getElementById('searchSpeakers').addEventListener('input', function(e) {
        filterSpeakers();
      });

      // Filter functionality
      document.getElementById('filterSchool').addEventListener('change', function(e) {
        filterSpeakers();
      });

      document.getElementById('filterPosition').addEventListener('change', function(e) {
        filterSpeakers();
      });
    }

    async function loadSchools() {
      try {
        console.log('🏫 Loading schools...');
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
          populateSchoolSelects();
          console.log('✅ Schools loaded:', schools.length);
        }
      } catch (error) {
        console.error('❌ Error loading schools:', error);
        showAlert('Erreur lors du chargement des écoles', 'danger');
      }
    }

    async function loadSpeakers() {
      try {
        console.log('👥 Loading speakers...');
        const response = await fetch('/api/speakers');
        const result = await response.json();
        
        if (result.success) {
          speakers = result.speakers;
          renderSpeakersTable();
          populatePositionFilter();
          console.log('✅ Speakers loaded:', speakers.length);
        } else {
          console.error('❌ API error:', result.error);
          showAlert('Erreur: ' + result.error, 'danger');
        }
      } catch (error) {
        console.error('❌ Error loading speakers:', error);
        showAlert('Erreur lors du chargement des formateurs', 'danger');
      }
    }

    function renderSpeakersTable() {
      console.log('🎨 Rendering table with', speakers.length, 'speakers');
      const tbody = document.getElementById('speakersTableBody');
      
      if (!tbody) {
        console.error('❌ Table body not found');
        return;
      }
      
      tbody.innerHTML = '';

      speakers.forEach((speaker, index) => {
        const school = schools.find(s => s.id === speaker.school_id);
        const fullName = (speaker.first_name || '') + ' ' + speaker.last_name;
        
        // Corriger l'URL de la photo si nécessaire
        let photoUrl = speaker.photo_url;
        if (photoUrl && photoUrl.includes('pub-undefined.r2.dev')) {
          // Remplacer l'ancien format par le nouveau
          photoUrl = photoUrl.replace('https://pub-undefined.r2.dev/', 'https://static.mediabuying.ac/');
        }
        
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>
            \${photoUrl ? 
              \`<img src="\${photoUrl}" alt="Photo" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">\` : 
              \`<div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="bi bi-person text-white"></i>
              </div>\`
            }
            \${photoUrl ? \`<div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; display: none;">
              <i class="bi bi-person text-white"></i>
            </div>\` : ''}
          </td>
          <td>
            <div class="fw-bold">\${fullName}</div>
            \${speaker.bio ? \`<small class="text-muted">\${speaker.bio.substring(0, 50)}\${speaker.bio.length > 50 ? '...' : ''}</small>\` : ''}
          </td>
          <td>
            <span class="badge bg-primary">\${school ? school.name : 'N/A'}</span>
          </td>
          <td>\${speaker.position || '-'}</td>
          <td>
            \${speaker.linkedin_url ? 
              \`<a href="\${speaker.linkedin_url}" target="_blank" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-linkedin"></i>
              </a>\` : 
              '-'
            }
          </td>
          <td>
            <small class="text-muted">\${new Date(speaker.created_at).toLocaleDateString('fr-FR')}</small>
          </td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-outline-primary" onclick="editSpeaker(\${speaker.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteSpeaker(\${speaker.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        
        tbody.appendChild(row);
      });
    }

    function populateSchoolSelects() {
      // Filter dropdown
      const filterSelect = document.getElementById('filterSchool');
      filterSelect.innerHTML = '<option value="">Toutes les écoles</option>';
      schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        filterSelect.appendChild(option);
      });

      // Modal dropdown
      const modalSelect = document.getElementById('speakerSchool');
      modalSelect.innerHTML = '<option value="">Sélectionner une école</option>';
      schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        modalSelect.appendChild(option);
      });
    }

    function populatePositionFilter() {
      const positions = [...new Set(speakers.map(s => s.position).filter(p => p))];
      const select = document.getElementById('filterPosition');
      select.innerHTML = '<option value="">Toutes les positions</option>';
      positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
        select.appendChild(option);
      });
    }

    function filterSpeakers() {
      const searchTerm = document.getElementById('searchSpeakers').value.toLowerCase();
      const schoolFilter = document.getElementById('filterSchool').value;
      const positionFilter = document.getElementById('filterPosition').value;

      const filtered = speakers.filter(speaker => {
        const schoolMatch = !schoolFilter || speaker.school_id == schoolFilter;
        const positionMatch = !positionFilter || speaker.position === positionFilter;
        const searchMatch = !searchTerm || 
          (speaker.first_name && speaker.first_name.toLowerCase().includes(searchTerm)) ||
          (speaker.last_name && speaker.last_name.toLowerCase().includes(searchTerm)) ||
          (speaker.position && speaker.position.toLowerCase().includes(searchTerm));

        return schoolMatch && positionMatch && searchMatch;
      });

      // Re-render table with filtered results
      const tbody = document.getElementById('speakersTableBody');
      tbody.innerHTML = '';

      filtered.forEach(speaker => {
        const school = schools.find(s => s.id === speaker.school_id);
        const fullName = (speaker.first_name || '') + ' ' + speaker.last_name;
        
        // Corriger l'URL de la photo si nécessaire
        let photoUrl = speaker.photo_url;
        if (photoUrl && photoUrl.includes('pub-undefined.r2.dev')) {
          // Remplacer l'ancien format par le nouveau
          photoUrl = photoUrl.replace('https://pub-undefined.r2.dev/', 'https://static.mediabuying.ac/');
        }
        
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>
            \${photoUrl ? 
              \`<img src="\${photoUrl}" alt="Photo" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">\` : 
              \`<div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="bi bi-person text-white"></i>
              </div>\`
            }
            \${photoUrl ? \`<div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; display: none;">
              <i class="bi bi-person text-white"></i>
            </div>\` : ''}
          </td>
          <td>
            <div class="fw-bold">\${fullName}</div>
            \${speaker.bio ? \`<small class="text-muted">\${speaker.bio.substring(0, 50)}\${speaker.bio.length > 50 ? '...' : ''}</small>\` : ''}
          </td>
          <td>
            <span class="badge bg-primary">\${school ? school.name : 'N/A'}</span>
          </td>
          <td>\${speaker.position || '-'}</td>
          <td>
            \${speaker.linkedin_url ? 
              \`<a href="\${speaker.linkedin_url}" target="_blank" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-linkedin"></i>
              </a>\` : 
              '-'
            }
          </td>
          <td>
            <small class="text-muted">\${new Date(speaker.created_at).toLocaleDateString('fr-FR')}</small>
          </td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-outline-primary" onclick="editSpeaker(\${speaker.id})" title="Modifier">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteSpeaker(\${speaker.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        
        tbody.appendChild(row);
      });
    }

    function clearFilters() {
      document.getElementById('searchSpeakers').value = '';
      document.getElementById('filterSchool').value = '';
      document.getElementById('filterPosition').value = '';
      renderSpeakersTable();
    }

    function showAddSpeakerModal() {
      console.log('➕ Opening add speaker modal');
      document.getElementById('speakerModalTitle').textContent = 'Ajouter Formateur';
      document.getElementById('speakerForm').reset();
      document.getElementById('speakerId').value = '';
      document.getElementById('photoPreview').style.display = 'none';
      document.getElementById('uploadProgress').style.display = 'none';
      
      const modal = new bootstrap.Modal(document.getElementById('speakerModal'));
      modal.show();
    }

    function editSpeaker(id) {
      console.log('✏️ Editing speaker:', id);
      const speaker = speakers.find(s => s.id === id);
      if (!speaker) return;

      document.getElementById('speakerModalTitle').textContent = 'Modifier Formateur';
      document.getElementById('speakerId').value = speaker.id;
      document.getElementById('firstName').value = speaker.first_name || '';
      document.getElementById('lastName').value = speaker.last_name || '';
      document.getElementById('speakerSchool').value = speaker.school_id || '';
      document.getElementById('position').value = speaker.position || '';
      document.getElementById('linkedinUrl').value = speaker.linkedin_url || '';
      document.getElementById('bio').value = speaker.bio || '';
      // Corriger l'URL de la photo si nécessaire
      let photoUrl = speaker.photo_url;
      if (photoUrl && photoUrl.includes('pub-undefined.r2.dev')) {
        photoUrl = photoUrl.replace('https://pub-undefined.r2.dev/', 'https://static.mediabuying.ac/');
      }
      
      document.getElementById('photoUrl').value = photoUrl || '';
      
      if (photoUrl) {
        document.getElementById('previewImage').src = photoUrl;
        document.getElementById('photoPreview').style.display = 'block';
      } else {
        document.getElementById('photoPreview').style.display = 'none';
      }
      
      const modal = new bootstrap.Modal(document.getElementById('speakerModal'));
      modal.show();
    }

    function deleteSpeaker(id) {
      console.log('🗑️ Deleting speaker:', id);
      deleteSpeakerId = id;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function saveSpeaker() {
      const formData = {
        id: document.getElementById('speakerId').value,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        school_id: document.getElementById('speakerSchool').value,
        position: document.getElementById('position').value,
        linkedin_url: document.getElementById('linkedinUrl').value,
        bio: document.getElementById('bio').value,
        photo_url: document.getElementById('photoUrl').value
      };

      if (!formData.first_name || !formData.last_name || !formData.school_id) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
        return;
      }

      try {
        const url = formData.id ? '/api/speakers/' + formData.id : '/api/speakers';
        const method = formData.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('speakerModal')).hide();
          loadSpeakers();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving speaker:', error);
        showAlert('Erreur lors de la sauvegarde', 'danger');
      }
    }

    async function confirmDelete() {
      if (!deleteSpeakerId) return;

      try {
        const response = await fetch('/api/speakers/' + deleteSpeakerId, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Formateur supprimé avec succès', 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadSpeakers();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting speaker:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
    }

    function refreshSpeakers() {
      loadSpeakers();
      showAlert('Formateurs actualisés', 'info');
    }

    async function handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showAlert('Type de fichier non autorisé. Seuls JPEG, PNG, GIF et WebP sont acceptés.', 'danger');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showAlert('Fichier trop volumineux. Taille maximum : 5MB.', 'danger');
        return;
      }

      const preview = document.getElementById('photoPreview');
      const previewImage = document.getElementById('previewImage');
      const reader = new FileReader();
      
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);

      await uploadPhotoToR2(file);
    }

    async function uploadPhotoToR2(file) {
      const progressContainer = document.getElementById('uploadProgress');
      const progressBar = progressContainer.querySelector('.progress-bar');
      
      try {
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress > 90) progress = 90;
          progressBar.style.width = progress + '%';
        }, 200);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'speakers');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        clearInterval(progressInterval);
        progressBar.style.width = '100%';

        if (result.success) {
          document.getElementById('photoUrl').value = result.url;
          showAlert('Photo uploadée avec succès !', 'success');
          setTimeout(() => {
            progressContainer.style.display = 'none';
          }, 1000);
        } else {
          showAlert('Erreur lors de l\\'upload : ' + result.error, 'danger');
          progressContainer.style.display = 'none';
        }

      } catch (error) {
        console.error('Erreur upload:', error);
        showAlert('Erreur lors de l\\'upload de la photo', 'danger');
        progressContainer.style.display = 'none';
      }
    }

    function removePhoto() {
      document.getElementById('photoUpload').value = '';
      document.getElementById('photoUrl').value = '';
      document.getElementById('photoPreview').style.display = 'none';
      document.getElementById('uploadProgress').style.display = 'none';
    }

    function showAlert(message, type) {
      const alertDiv = document.getElementById('alert');
      alertDiv.innerHTML = \`
        <div class="alert alert-\${type} alert-dismissible fade show" role="alert">
          \${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      \`;
      
      setTimeout(() => {
        const alert = alertDiv.querySelector('.alert');
        if (alert) {
          alert.remove();
        }
      }, 5000);
    }

    // Make functions globally accessible
    window.showAddSpeakerModal = showAddSpeakerModal;
    window.editSpeaker = editSpeaker;
    window.deleteSpeaker = deleteSpeaker;
    window.saveSpeaker = saveSpeaker;
    window.confirmDelete = confirmDelete;
    window.refreshSpeakers = refreshSpeakers;
    window.handlePhotoUpload = handlePhotoUpload;
    window.removePhoto = removePhoto;
    window.clearFilters = clearFilters;
  `;

  return getAdminLayout('Speakers', content, '/speakers', user) + `<script>${scripts}</script>`;
}
