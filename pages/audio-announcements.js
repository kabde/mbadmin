// ===== PAGE AUDIO ANNOUNCEMENTS - Admin MBA =====
// Page pour gérer les annonces audio

import { getAdminLayout } from '../templates/layout.js';

export function getAudioAnnouncementsPage(user) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Gestion des Annonces Audio</h1>
          <p class="text-muted mb-0">Créez et gérez les annonces audio pour vos programmes</p>
        </div>
        <div>
          <button type="button" class="btn btn-primary" id="btnAddAnnouncement">
            <i class="bi bi-plus-circle me-2"></i>Nouvelle Annonce
          </button>
        </div>
      </div>

      <!-- Alert Container -->
      <div id="alertContainer"></div>

      <!-- Announcements List -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Liste des Annonces</h5>
            <button type="button" class="btn btn-outline-secondary btn-sm" id="btnRefresh">
              <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Programmes Cibles</th>
                  <th>Durée</th>
                  <th>Taille</th>
                  <th>Statut</th>
                  <th>Créé le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="announcementsTableBody">
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

    <!-- Add/Edit Announcement Modal -->
    <div class="modal fade" id="announcementModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="announcementModalTitle">Nouvelle Annonce Audio</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="announcementForm">
              <input type="hidden" id="announcementId">
              
              <div class="mb-3">
                <label for="announcementTitle" class="form-label">Titre *</label>
                <input type="text" class="form-control" id="announcementTitle" required placeholder="Titre de l'annonce">
              </div>

              <div class="mb-3">
                <label for="announcementDescription" class="form-label">Description</label>
                <textarea class="form-control" id="announcementDescription" rows="3" placeholder="Description de l'annonce..."></textarea>
              </div>

              <div class="mb-3">
                <label for="targetPrograms" class="form-label">Programmes Cibles *</label>
                <select class="form-select" id="targetPrograms" multiple size="5" required>
                  <option value="">Chargement des programmes...</option>
                </select>
                <small class="form-text text-muted">Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs programmes</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Enregistrement Audio *</label>
                <div class="card border-primary">
                  <div class="card-body">
                    <div class="d-flex justify-content-center align-items-center gap-3 mb-3">
                      <button type="button" class="btn btn-success btn-lg" id="btnStartRecording">
                        <i class="bi bi-mic-fill me-2"></i>Démarrer l'enregistrement
                      </button>
                      <button type="button" class="btn btn-danger btn-lg" id="btnStopRecording" style="display: none;">
                        <i class="bi bi-stop-fill me-2"></i>Arrêter
                      </button>
                    </div>
                    <div id="recordingStatus" class="text-center mb-3" style="display: none;">
                      <div class="spinner-border text-danger spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Enregistrement...</span>
                      </div>
                      <span id="recordingTime">00:00</span>
                      <small class="text-danger ms-2">Enregistrement en cours...</small>
                    </div>
                    <div class="upload-progress mt-2" id="audioUploadProgress" style="display: none;">
                      <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                      </div>
                      <small class="text-muted">Upload en cours...</small>
                    </div>
                    <div class="mt-2" id="audioPreview" style="display: none;">
                      <audio controls id="previewAudio" class="w-100"></audio>
                      <div class="mt-2">
                        <small class="text-muted" id="audioInfo"></small>
                      </div>
                      <button type="button" class="btn btn-sm btn-outline-danger mt-2" id="btnRemoveAudio">
                        <i class="bi bi-trash me-1"></i>Supprimer l'enregistrement
                      </button>
                    </div>
                    <input type="hidden" id="audioUrl">
                    <input type="hidden" id="audioKey">
                    <input type="hidden" id="audioDuration">
                    <input type="hidden" id="audioFileSize">
                    <input type="hidden" id="audioMimeType">
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="announcementActive" checked>
                  <label class="form-check-label" for="announcementActive">
                    Annonce active
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" id="btnSaveAnnouncement">Enregistrer</button>
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
            <p>Êtes-vous sûr de vouloir supprimer cette annonce audio ?</p>
            <p class="text-muted">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" id="btnConfirmDelete">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      (function() {
        'use strict';
        
        let announcements = [];
        let programs = [];
        let deleteAnnouncementId = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Audio Announcements page initialized');
          initEventListeners();
          loadPrograms();
          loadAnnouncements();
        });

        function initEventListeners() {
          const btnAdd = document.getElementById('btnAddAnnouncement');
          if (btnAdd) {
            btnAdd.addEventListener('click', function() {
              showAddAnnouncementModal();
            });
          }

          const btnRefresh = document.getElementById('btnRefresh');
          if (btnRefresh) {
            btnRefresh.addEventListener('click', function() {
              loadAnnouncements();
            });
          }

          const btnSave = document.getElementById('btnSaveAnnouncement');
          if (btnSave) {
            btnSave.addEventListener('click', function() {
              saveAnnouncement();
            });
          }

          const btnConfirmDelete = document.getElementById('btnConfirmDelete');
          if (btnConfirmDelete) {
            btnConfirmDelete.addEventListener('click', function() {
              confirmDelete();
            });
          }

          const btnStartRecording = document.getElementById('btnStartRecording');
          if (btnStartRecording) {
            btnStartRecording.addEventListener('click', function() {
              startRecording();
            });
          }

          const btnStopRecording = document.getElementById('btnStopRecording');
          if (btnStopRecording) {
            btnStopRecording.addEventListener('click', function() {
              stopRecording();
            });
          }

          const btnRemoveAudio = document.getElementById('btnRemoveAudio');
          if (btnRemoveAudio) {
            btnRemoveAudio.addEventListener('click', function() {
              removeAudio();
            });
          }
        }

        let mediaRecorder = null;
        let audioChunks = [];
        let recordingStartTime = null;
        let recordingTimer = null;

        async function loadPrograms() {
          try {
            const response = await fetch('/api/programs');
            const result = await response.json();
            if (result.success) {
              programs = result.programs || [];
              const select = document.getElementById('targetPrograms');
              if (select) {
                select.innerHTML = '';
                programs.forEach(prog => {
                  const option = document.createElement('option');
                  option.value = prog.id;
                  option.textContent = prog.title;
                  select.appendChild(option);
                });
              }
            }
          } catch (error) {
            console.error('Error loading programs:', error);
          }
        }

        async function loadAnnouncements() {
          try {
            const tbody = document.getElementById('announcementsTableBody');
            if (tbody) {
              tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></td></tr>';
            }
            
            const response = await fetch('/api/audio-announcements');
            const result = await response.json();
            
            if (result.success) {
              announcements = result.announcements || [];
              renderTable();
            } else {
              showError('Erreur lors du chargement: ' + (result.error || 'Erreur inconnue'));
              if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-danger">Erreur lors du chargement</td></tr>';
              }
            }
          } catch (error) {
            console.error('Error loading announcements:', error);
            showError('Erreur: ' + error.message);
            const tbody = document.getElementById('announcementsTableBody');
            if (tbody) {
              tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-danger">Erreur: ' + error.message + '</td></tr>';
            }
          }
        }

        function renderTable() {
          const tbody = document.getElementById('announcementsTableBody');
          
          if (announcements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Aucune annonce audio</td></tr>';
            return;
          }

          tbody.innerHTML = '';
          announcements.forEach(function(announcement) {
            const row = document.createElement('tr');
            
            // Parse target programs
            let programsText = 'Aucun';
            if (announcement.target_programs) {
              try {
                const programIds = typeof announcement.target_programs === 'string' 
                  ? JSON.parse(announcement.target_programs) 
                  : announcement.target_programs;
                if (Array.isArray(programIds) && programIds.length > 0) {
                  const programNames = programIds.map(id => {
                    const prog = programs.find(p => p.id == id);
                    return prog ? prog.title : 'Programme #' + id;
                  });
                  programsText = programNames.join(', ');
                }
              } catch (e) {
                console.error('Error parsing target_programs:', e);
              }
            }

            const duration = announcement.duration ? formatDuration(announcement.duration) : 'N/A';
            const fileSize = announcement.file_size ? formatFileSize(announcement.file_size) : 'N/A';
            const statusBadge = announcement.is_active ? 
              '<span class="badge bg-success">Actif</span>' : 
              '<span class="badge bg-secondary">Inactif</span>';
            const createdDate = announcement.created_at ? 
              new Date(announcement.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A';

            row.innerHTML = 
              '<td><strong>' + escapeHtml(announcement.title || 'Sans titre') + '</strong></td>' +
              '<td><small>' + escapeHtml(programsText) + '</small></td>' +
              '<td>' + duration + '</td>' +
              '<td>' + fileSize + '</td>' +
              '<td>' + statusBadge + '</td>' +
              '<td><small class="text-muted">' + createdDate + '</small></td>' +
              '<td>' +
              '<div class="btn-group btn-group-sm">' +
              '<button type="button" class="btn btn-outline-primary btn-play" data-id="' + announcement.id + '" data-url="' + escapeHtml(announcement.audio_url || '') + '" title="Écouter"><i class="bi bi-play-circle"></i></button>' +
              '<button type="button" class="btn btn-outline-secondary btn-edit" data-id="' + announcement.id + '" title="Modifier"><i class="bi bi-pencil"></i></button>' +
              '<button type="button" class="btn btn-outline-danger btn-delete" data-id="' + announcement.id + '" title="Supprimer"><i class="bi bi-trash"></i></button>' +
              '</div>' +
              '</td>';

            tbody.appendChild(row);
          });

          // Attach event listeners
          tbody.querySelectorAll('.btn-play').forEach(function(btn) {
            btn.addEventListener('click', function() {
              const url = this.getAttribute('data-url');
              if (url) {
                window.open(url, '_blank');
              }
            });
          });

          tbody.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
              const id = parseInt(this.getAttribute('data-id'));
              editAnnouncement(id);
            });
          });

          tbody.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
              const id = parseInt(this.getAttribute('data-id'));
              deleteAnnouncement(id);
            });
          });
        }

        function showAddAnnouncementModal() {
          document.getElementById('announcementModalTitle').textContent = 'Nouvelle Annonce Audio';
          document.getElementById('announcementForm').reset();
          document.getElementById('announcementId').value = '';
          document.getElementById('audioPreview').style.display = 'none';
          document.getElementById('audioUploadProgress').style.display = 'none';
          document.getElementById('recordingStatus').style.display = 'none';
          document.getElementById('btnStartRecording').style.display = 'inline-block';
          document.getElementById('btnStopRecording').style.display = 'none';
          document.getElementById('audioUrl').value = '';
          document.getElementById('audioKey').value = '';
          document.getElementById('audioDuration').value = '';
          document.getElementById('audioFileSize').value = '';
          document.getElementById('audioMimeType').value = '';
          
          // Arrêter l'enregistrement si en cours
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            stopRecording();
          }
          
          const modal = new bootstrap.Modal(document.getElementById('announcementModal'));
          modal.show();
        }

        function editAnnouncement(id) {
          const announcement = announcements.find(a => a.id === id);
          if (!announcement) return;

          document.getElementById('announcementModalTitle').textContent = 'Modifier Annonce Audio';
          document.getElementById('announcementId').value = announcement.id;
          document.getElementById('announcementTitle').value = announcement.title || '';
          document.getElementById('announcementDescription').value = announcement.description || '';
          document.getElementById('audioUrl').value = announcement.audio_url || '';
          document.getElementById('audioKey').value = announcement.audio_key || '';
          document.getElementById('announcementActive').checked = announcement.is_active !== 0;

          // Set target programs
          const select = document.getElementById('targetPrograms');
          if (select && announcement.target_programs) {
            try {
              const programIds = typeof announcement.target_programs === 'string' 
                ? JSON.parse(announcement.target_programs) 
                : announcement.target_programs;
              if (Array.isArray(programIds)) {
                Array.from(select.options).forEach(option => {
                  option.selected = programIds.includes(parseInt(option.value));
                });
              }
            } catch (e) {
              console.error('Error parsing target_programs:', e);
            }
          }

          // Show audio preview if exists
          if (announcement.audio_url) {
            const preview = document.getElementById('audioPreview');
            const audio = document.getElementById('previewAudio');
            audio.src = announcement.audio_url;
            preview.style.display = 'block';
            document.getElementById('btnStartRecording').style.display = 'none';
            if (announcement.duration) {
              document.getElementById('audioInfo').textContent = 
                'Durée: ' + formatDuration(announcement.duration) + 
                (announcement.file_size ? ' | Taille: ' + formatFileSize(announcement.file_size) : '');
            }
          } else {
            document.getElementById('btnStartRecording').style.display = 'inline-block';
          }

          const modal = new bootstrap.Modal(document.getElementById('announcementModal'));
          modal.show();
        }

        function deleteAnnouncement(id) {
          deleteAnnouncementId = id;
          const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
          modal.show();
        }

        async function startRecording() {
          try {
            // Demander l'accès au microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Créer un MediaRecorder avec WebM (meilleure compatibilité)
            mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'audio/webm;codecs=opus'
            });
            
            audioChunks = [];
            
            mediaRecorder.ondataavailable = function(event) {
              if (event.data.size > 0) {
                audioChunks.push(event.data);
              }
            };
            
            mediaRecorder.onstop = async function() {
              // Créer un blob à partir des chunks
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              
              // Créer un fichier à partir du blob
              const fileName = 'recording-' + Date.now() + '.webm';
              const audioFile = new File([audioBlob], fileName, { type: 'audio/webm' });
              
              // Arrêter le stream
              stream.getTracks().forEach(track => track.stop());
              
              // Upload vers R2
              await uploadAudioToR2(audioFile);
              
              // Réinitialiser
              audioChunks = [];
              recordingStartTime = null;
              if (recordingTimer) {
                clearInterval(recordingTimer);
                recordingTimer = null;
              }
            };
            
            // Démarrer l'enregistrement
            mediaRecorder.start();
            recordingStartTime = Date.now();
            
            // Afficher les boutons
            document.getElementById('btnStartRecording').style.display = 'none';
            document.getElementById('btnStopRecording').style.display = 'inline-block';
            document.getElementById('recordingStatus').style.display = 'block';
            
            // Démarrer le timer
            recordingTimer = setInterval(function() {
              if (recordingStartTime) {
                const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
                const mins = Math.floor(elapsed / 60);
                const secs = elapsed % 60;
                document.getElementById('recordingTime').textContent = 
                  String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
              }
            }, 1000);
            
          } catch (error) {
            console.error('Error starting recording:', error);
            showError('Erreur lors du demarrage de lenregistrement: ' + error.message);
          }
        }

        function stopRecording() {
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            
            // Masquer les boutons
            document.getElementById('btnStartRecording').style.display = 'inline-block';
            document.getElementById('btnStopRecording').style.display = 'none';
            document.getElementById('recordingStatus').style.display = 'none';
          }
        }

        function removeAudio() {
          document.getElementById('audioUrl').value = '';
          document.getElementById('audioKey').value = '';
          document.getElementById('audioDuration').value = '';
          document.getElementById('audioFileSize').value = '';
          document.getElementById('audioMimeType').value = '';
          document.getElementById('audioPreview').style.display = 'none';
          document.getElementById('previewAudio').src = '';
          document.getElementById('btnStartRecording').style.display = 'inline-block';
        }

        async function uploadAudioToR2(file) {
          const progressContainer = document.getElementById('audioUploadProgress');
          const progressBar = progressContainer.querySelector('.progress-bar');
          const preview = document.getElementById('audioPreview');
          const audio = document.getElementById('previewAudio');
          
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
            formData.append('type', 'audio');

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });

            const result = await response.json();

            clearInterval(progressInterval);
            progressBar.style.width = '100%';

            if (result.success) {
              document.getElementById('audioUrl').value = result.url;
              document.getElementById('audioKey').value = result.path;
              document.getElementById('audioFileSize').value = result.size;
              document.getElementById('audioMimeType').value = result.type;

              // Show preview
              audio.src = result.url;
              preview.style.display = 'block';

              // Try to get duration (this is approximate, actual duration would need audio metadata)
              audio.addEventListener('loadedmetadata', function() {
                const duration = Math.round(audio.duration);
                document.getElementById('audioDuration').value = duration;
                document.getElementById('audioInfo').textContent = 
                  'Durée: ' + formatDuration(duration) + ' | Taille: ' + formatFileSize(result.size);
              });

              showSuccess('Audio uploadé avec succès !');
              setTimeout(() => {
                progressContainer.style.display = 'none';
              }, 1000);
            } else {
              showError('Erreur lors de l\\'upload : ' + (result.error || 'Erreur inconnue'));
              progressContainer.style.display = 'none';
            }

          } catch (error) {
            console.error('Erreur upload audio:', error);
            showError('Erreur: ' + error.message);
            progressContainer.style.display = 'none';
          }
        }

        async function saveAnnouncement() {
          const formData = {
            id: document.getElementById('announcementId').value,
            title: document.getElementById('announcementTitle').value,
            description: document.getElementById('announcementDescription').value,
            audio_url: document.getElementById('audioUrl').value,
            audio_key: document.getElementById('audioKey').value,
            duration: parseInt(document.getElementById('audioDuration').value) || null,
            file_size: parseInt(document.getElementById('audioFileSize').value) || null,
            mime_type: document.getElementById('audioMimeType').value || null,
            target_programs: Array.from(document.getElementById('targetPrograms').selectedOptions).map(opt => parseInt(opt.value)),
            is_active: document.getElementById('announcementActive').checked ? 1 : 0
          };

          if (!formData.title) {
            showError('Le titre est obligatoire');
            return;
          }

          if (!formData.audio_url) {
            showError('Le fichier audio est obligatoire');
            return;
          }

          if (!formData.target_programs || formData.target_programs.length === 0) {
            showError('Veuillez sélectionner au moins un programme cible');
            return;
          }

          try {
            const url = formData.id ? '/api/audio-announcements/' + formData.id : '/api/audio-announcements';
            const method = formData.id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
              showSuccess(result.message || 'Annonce enregistrée avec succès');
              bootstrap.Modal.getInstance(document.getElementById('announcementModal')).hide();
              loadAnnouncements();
            } else {
              showError(result.error || 'Erreur lors de l\\'enregistrement');
            }
          } catch (error) {
            console.error('Error saving announcement:', error);
            showError('Erreur: ' + error.message);
          }
        }

        async function confirmDelete() {
          if (!deleteAnnouncementId) return;

          try {
            const response = await fetch('/api/audio-announcements/' + deleteAnnouncementId, {
              method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
              showSuccess('Annonce supprimée avec succès');
              bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
              loadAnnouncements();
            } else {
              showError(result.error || 'Erreur lors de la suppression');
            }
          } catch (error) {
            console.error('Error deleting announcement:', error);
            showError('Erreur: ' + error.message);
          }
        }

        function formatDuration(seconds) {
          if (!seconds) return 'N/A';
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return mins + ':' + String(secs).padStart(2, '0');
        }

        function formatFileSize(bytes) {
          if (!bytes) return 'N/A';
          if (bytes < 1024) return bytes + ' B';
          if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
          return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        function escapeHtml(text) {
          if (!text) return '';
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        }

        function showError(message) {
          const container = document.getElementById('alertContainer');
          container.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
            escapeHtml(message) +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }

        function showSuccess(message) {
          const container = document.getElementById('alertContainer');
          container.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
            escapeHtml(message) +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
      })();
    </script>
  `;

  return getAdminLayout('Annonces Audio', content, '/audio-announcements', user);
}

