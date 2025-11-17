// ===== PAGE CLASS FEEDBACKS - Admin MBA =====
// Page pour afficher tous les feedbacks d'une classe

import { getAdminLayout } from '../templates/layout.js';

export function getClassFeedbacksPage(user, classId) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Feedbacks de la Classe</h1>
          <p class="text-muted mb-0" id="classInfo">Chargement...</p>
        </div>
        <div>
          <a href="/tafs/feedbacks" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Retour au classement
          </a>
        </div>
      </div>

      <!-- Alert Container -->
      <div id="alertContainer"></div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="filterTaf" class="form-label">Filtrer par TAF</label>
              <select class="form-select" id="filterTaf">
                <option value="">Tous les TAFs</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="sortOrder" class="form-label">Trier par</label>
              <select class="form-select" id="sortOrder">
                <option value="recent">Plus récents en premier</option>
                <option value="oldest">Plus anciens en premier</option>
                <option value="name">Par nom (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedbacks List -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Liste des Feedbacks</h5>
            <div>
              <span class="badge bg-primary" id="feedbackCount">0</span>
            </div>
          </div>
          
          <div id="feedbacksList">
            <div class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Evaluation Modal -->
    <div class="modal fade" id="evaluationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Évaluer le Feedback</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="evaluationForm">
              <input type="hidden" id="evaluationFeedbackId" name="feedback_id">
              
              <div class="mb-3">
                <label for="evaluationStatus" class="form-label">Statut de l'évaluation</label>
                <select class="form-select" id="evaluationStatus" name="evaluation_status" required>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                  <option value="needs_revision">Nécessite une révision</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="evaluationComment" class="form-label">Commentaire d'évaluation</label>
                <textarea class="form-control" id="evaluationComment" name="evaluation" rows="4" placeholder="Votre commentaire d'évaluation..."></textarea>
              </div>

              <div class="mb-3">
                <label for="evaluationData" class="form-label">Données supplémentaires (JSON)</label>
                <textarea class="form-control" id="evaluationData" name="evaluation_data" rows="3" placeholder='{"note": 5, "criteria": {...}}'></textarea>
                <small class="form-text text-muted">Optionnel: Données supplémentaires au format JSON</small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-outline-primary" id="generateEvaluationBtn">
              <i class="bi bi-magic me-1"></i>Générer avec ChatGPT
            </button>
            <button type="button" class="btn btn-primary" id="saveEvaluationBtn">Enregistrer l'évaluation</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      (function() {
        'use strict';
        
        const classId = ${classId};
        let allFeedbacks = [];
        let filteredFeedbacks = [];
        let tafs = [];

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Class Feedbacks page initialized for class:', classId);
          initEventListeners();
          loadTafs();
          loadFeedbacks();
        });

        function initEventListeners() {
          const filterTaf = document.getElementById('filterTaf');
          if (filterTaf) filterTaf.addEventListener('change', filterAndSort);
          
          const sortOrder = document.getElementById('sortOrder');
          if (sortOrder) sortOrder.addEventListener('change', filterAndSort);

          const saveEvaluationBtn = document.getElementById('saveEvaluationBtn');
          if (saveEvaluationBtn) {
            saveEvaluationBtn.addEventListener('click', saveEvaluation);
          }

          const generateEvaluationBtn = document.getElementById('generateEvaluationBtn');
          if (generateEvaluationBtn) {
            generateEvaluationBtn.addEventListener('click', generateEvaluation);
          }
        }

        async function loadTafs() {
          try {
            const response = await fetch('/api/tafs');
            const result = await response.json();
            if (result.success) {
              tafs = result.tafs || [];
              const select = document.getElementById('filterTaf');
              if (select) {
                tafs.forEach(taf => {
                  const content = taf.content || {};
                  const firstLang = Object.keys(content)[0] || 'fr';
                  const title = content[firstLang]?.title || 'TAF #' + taf.id;
                  select.add(new Option(title, taf.id));
                });
              }
            }
          } catch (error) {
            console.error('Error loading TAFs:', error);
          }
        }

        async function loadFeedbacks() {
          try {
            const response = await fetch('/api/taf-feedbacks?class_id=' + classId);
            const result = await response.json();
            
            console.log('API Response:', result);
            
            if (result.success) {
              allFeedbacks = result.feedbacks || [];
              console.log('Loaded feedbacks:', allFeedbacks.length);
              
              // Charger les infos de la classe
              const classResponse = await fetch('/api/classes');
              const classResult = await classResponse.json();
              if (classResult.success) {
                const classInfo = classResult.classes.find(c => c.id == classId);
                if (classInfo) {
                  const classInfoEl = document.getElementById('classInfo');
                  if (classInfoEl) {
                    classInfoEl.textContent = classInfo.title || classInfo.code || 'Classe #' + classId;
                  }
                }
              }
              
              setTimeout(function() {
                filterAndSort();
              }, 100);
            } else {
              console.error('API Error:', result);
              showError('Erreur lors du chargement: ' + (result.error || 'Erreur inconnue'));
              renderFeedbacks([]);
            }
          } catch (error) {
            console.error('Error loading feedbacks:', error);
            showError('Erreur: ' + error.message);
            renderFeedbacks([]);
          }
        }

        function filterAndSort() {
          const filterTafEl = document.getElementById('filterTaf');
          const sortOrderEl = document.getElementById('sortOrder');
          
          const tafId = filterTafEl ? filterTafEl.value : '';
          const sortOrder = sortOrderEl ? sortOrderEl.value : 'recent';

          filteredFeedbacks = allFeedbacks.filter(function(feedback) {
            return !tafId || feedback.taf_id == tafId;
          });

          filteredFeedbacks.sort(function(a, b) {
            if (sortOrder === 'recent') {
              return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortOrder === 'oldest') {
              return new Date(a.created_at) - new Date(b.created_at);
            } else if (sortOrder === 'name') {
              const nameA = (a.member_name || '').toLowerCase();
              const nameB = (b.member_name || '').toLowerCase();
              return nameA.localeCompare(nameB);
            }
            return 0;
          });

          renderFeedbacks(filteredFeedbacks);
        }

        function renderFeedbacks(feedbacks) {
          const container = document.getElementById('feedbacksList');
          const countEl = document.getElementById('feedbackCount');
          
          if (countEl) {
            countEl.textContent = feedbacks.length;
          }
          
          if (feedbacks.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Aucun feedback trouvé pour cette classe.</div>';
            return;
          }

          // Utiliser createElement pour éviter les problèmes d'échappement
          const listGroup = document.createElement('div');
          listGroup.className = 'list-group';
          
          feedbacks.forEach(function(feedback) {
            const date = new Date(feedback.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const tafTitle = feedback.taf_title || ('TAF #' + feedback.taf_id);
            
            const item = document.createElement('div');
            item.className = 'list-group-item';
            
            // Header avec nom et date
            const header = document.createElement('div');
            header.className = 'd-flex justify-content-between align-items-start mb-2';
            
            const leftDiv = document.createElement('div');
            leftDiv.className = 'flex-grow-1';
            
            const nameH6 = document.createElement('h6');
            nameH6.className = 'mb-1';
            nameH6.textContent = feedback.member_name || 'Anonyme';
            
            const tafSmall = document.createElement('small');
            tafSmall.className = 'text-muted';
            tafSmall.textContent = tafTitle;
            
            leftDiv.appendChild(nameH6);
            leftDiv.appendChild(tafSmall);
            
            const dateSmall = document.createElement('small');
            dateSmall.className = 'text-muted';
            dateSmall.textContent = date;
            
            header.appendChild(leftDiv);
            header.appendChild(dateSmall);
            item.appendChild(header);
            
            // Texte du feedback
            const textP = document.createElement('p');
            textP.className = 'mb-0';
            textP.textContent = feedback.feedback_text || '';
            item.appendChild(textP);
            
            // Évaluation existante
            if (feedback.evaluation || feedback.evaluation_data) {
              const evalDiv = document.createElement('div');
              evalDiv.className = 'mt-3 p-3 bg-light rounded border-start border-3 border-primary';
              
              const evalHeader = document.createElement('div');
              evalHeader.className = 'd-flex justify-content-between align-items-center mb-2';
              
              const evalStrong = document.createElement('strong');
              evalStrong.className = 'text-primary';
              evalStrong.textContent = 'Évaluation:';
              
              evalHeader.appendChild(evalStrong);
              
              if (feedback.evaluation_status) {
                const statusBadge = document.createElement('span');
                statusBadge.className = 'badge';
                if (feedback.evaluation_status === 'approved') {
                  statusBadge.className += ' bg-success';
                  statusBadge.textContent = 'Approuvé';
                } else if (feedback.evaluation_status === 'rejected') {
                  statusBadge.className += ' bg-danger';
                  statusBadge.textContent = 'Rejeté';
                } else if (feedback.evaluation_status === 'needs_revision') {
                  statusBadge.className += ' bg-warning';
                  statusBadge.textContent = 'Nécessite révision';
                } else {
                  statusBadge.className += ' bg-secondary';
                  statusBadge.textContent = 'En attente';
                }
                evalHeader.appendChild(statusBadge);
              }
              
              evalDiv.appendChild(evalHeader);
              
              if (feedback.evaluation) {
                const evalP = document.createElement('p');
                evalP.className = 'mb-2';
                evalP.textContent = feedback.evaluation;
                evalDiv.appendChild(evalP);
              }
              
              if (feedback.evaluation_date) {
                const evalDate = new Date(feedback.evaluation_date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const evalDateSmall = document.createElement('small');
                evalDateSmall.className = 'text-muted';
                evalDateSmall.textContent = 'Évalué le ' + evalDate;
                evalDiv.appendChild(evalDateSmall);
              }
              
              item.appendChild(evalDiv);
            }
            
            // Bouton Évaluer
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'mt-2';
            
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-sm btn-outline-primary';
            button.onclick = function() {
              openEvaluationModal(feedback.id);
            };
            
            const icon = document.createElement('i');
            icon.className = 'bi bi-star me-1';
            button.appendChild(icon);
            
            const buttonText = document.createTextNode(feedback.evaluation ? 'Modifier evaluation' : 'Évaluer');
            button.appendChild(buttonText);
            
            buttonDiv.appendChild(button);
            item.appendChild(buttonDiv);
            
            listGroup.appendChild(item);
          });
          
          container.innerHTML = '';
          container.appendChild(listGroup);
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

        let currentFeedbackData = null;

        function openEvaluationModal(feedbackId) {
          const modal = new bootstrap.Modal(document.getElementById('evaluationModal'));
          
          const feedback = allFeedbacks.find(f => f.id == feedbackId);
          
          if (!feedback) {
            showError('Feedback introuvable');
            return;
          }

          // Stocker les données du feedback pour la génération
          currentFeedbackData = feedback;
          
          document.getElementById('evaluationFeedbackId').value = feedbackId;
          document.getElementById('evaluationStatus').value = feedback.evaluation_status || 'pending';
          document.getElementById('evaluationComment').value = feedback.evaluation || '';
          
          if (feedback.evaluation_data) {
            try {
              const data = typeof feedback.evaluation_data === 'string' 
                ? JSON.parse(feedback.evaluation_data) 
                : feedback.evaluation_data;
              document.getElementById('evaluationData').value = JSON.stringify(data, null, 2);
            } catch (e) {
              document.getElementById('evaluationData').value = feedback.evaluation_data;
            }
          } else {
            document.getElementById('evaluationData').value = '';
          }
          
          modal.show();
        }

        async function generateEvaluation() {
          if (!currentFeedbackData) {
            showError('Aucun feedback sélectionné');
            return;
          }

          const generateBtn = document.getElementById('generateEvaluationBtn');
          const originalText = generateBtn.innerHTML;
          
          try {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Génération...';

            console.log('Sending request to generate evaluation...', {
              feedback_id: currentFeedbackData.id,
              feedback_text: currentFeedbackData.feedback_text?.substring(0, 100) + '...'
            });

            const response = await fetch('/api/taf-feedbacks/generate-evaluation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                feedback_id: currentFeedbackData.id,
                feedback_text: currentFeedbackData.feedback_text || '',
                member_name: currentFeedbackData.member_name || '',
                class_code: currentFeedbackData.class_code || '',
                taf_title: currentFeedbackData.taf_title || ''
              })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
              const errorText = await response.text();
              console.error('API Error:', errorText);
              showError('Erreur HTTP: ' + response.status + ' - ' + errorText);
              return;
            }

            const result = await response.json();
            console.log('API Result:', result);

            if (result.success && result.evaluation) {
              // Remplir le champ JSON avec TOUTES les données générées
              const evaluationDataField = document.getElementById('evaluationData');
              if (evaluationDataField && result.evaluation.evaluation_data) {
                evaluationDataField.value = JSON.stringify(result.evaluation.evaluation_data, null, 2);
                console.log('Evaluation data filled:', result.evaluation.evaluation_data);
              } else {
                console.error('evaluationData field not found or no data');
              }
              
              // Remplir le commentaire si disponible
              const evaluationCommentField = document.getElementById('evaluationComment');
              if (evaluationCommentField && result.evaluation.evaluation) {
                evaluationCommentField.value = result.evaluation.evaluation;
              }

              // Remplir le statut si disponible
              const evaluationStatusField = document.getElementById('evaluationStatus');
              if (evaluationStatusField && result.evaluation.evaluation_status) {
                evaluationStatusField.value = result.evaluation.evaluation_status;
              }

              showSuccess('Évaluation générée avec succès');
            } else {
              console.error('API returned error:', result);
              showError('Erreur lors de la génération: ' + (result.error || 'Erreur inconnue'));
            }
          } catch (error) {
            console.error('Error generating evaluation:', error);
            showError('Erreur: ' + error.message);
          } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
          }
        }

        async function saveEvaluation() {
          const feedbackId = document.getElementById('evaluationFeedbackId').value;
          const evaluationStatus = document.getElementById('evaluationStatus').value;
          const evaluationComment = document.getElementById('evaluationComment').value;
          const evaluationData = document.getElementById('evaluationData').value;

          if (!feedbackId) {
            showError('Erreur: ID du feedback manquant');
            return;
          }

          let evaluationDataJson = null;
          if (evaluationData && evaluationData.trim()) {
            try {
              evaluationDataJson = JSON.parse(evaluationData);
            } catch (e) {
              showError('Erreur: Le format JSON des données supplémentaires est invalide');
              return;
            }
          }

          try {
            const response = await fetch('/api/taf-feedbacks', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: feedbackId,
                evaluation: evaluationComment,
                evaluation_data: evaluationDataJson,
                evaluation_status: evaluationStatus
              })
            });

            const result = await response.json();

            if (result.success) {
              showSuccess('Évaluation enregistrée avec succès');
              bootstrap.Modal.getInstance(document.getElementById('evaluationModal')).hide();
              loadFeedbacks();
            } else {
              showError('Erreur lors de l enregistrement: ' + (result.error || 'Erreur inconnue'));
            }
          } catch (error) {
            console.error('Error saving evaluation:', error);
            showError('Erreur: ' + error.message);
          }
        }

        window.openEvaluationModal = openEvaluationModal;
      })();
    </script>
  `;

  return getAdminLayout('Feedbacks de la Classe', content, '/tafs/feedbacks', user);
}
