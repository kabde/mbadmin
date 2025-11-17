// ===== PAGE TAF FEEDBACKS - Admin MBA =====
// Page de classement des feedbacks TAF par classe

import { getAdminLayout } from '../templates/layout.js';

export function getTafFeedbacksPage(user) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Classement des Feedbacks TAF par Classe</h1>
          <p class="text-muted mb-0">Consultez les feedbacks des TAFs classés par classe</p>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-primary" id="btnProcessEvaluations">
            <i class="bi bi-magic me-2"></i>Traitement Automatique
          </button>
          <a href="/tafs" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Retour aux TAFs
          </a>
        </div>
      </div>

      <!-- Alert Container -->
      <div id="alertContainer"></div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterTaf" class="form-label">TAF</label>
              <select class="form-select" id="filterTaf">
                <option value="">Tous les TAFs</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="filterClass" class="form-label">Classe</label>
              <select class="form-select" id="filterClass">
                <option value="">Toutes les classes</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="filterProgram" class="form-label">Programme</label>
              <select class="form-select" id="filterProgram">
                <option value="">Tous les programmes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Rankings Table -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Classement par Classe</h5>
            <button type="button" class="btn btn-outline-secondary btn-sm" id="btnRefresh">
              <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Classe</th>
                  <th>TAF</th>
                  <th>Programme</th>
                  <th>Nombre de Feedbacks</th>
                  <th>Critère</th>
                  <th>Dernière Soumission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="tableBody">
                <tr>
                  <td colspan="8" class="text-center py-4">
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

    <script>
      (function() {
        'use strict';
        
        let feedbacksData = [];
        let filteredData = [];
        let tafs = [];
        let classes = [];
        let programs = [];

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
          console.log('TAF Feedbacks page initialized');
          initEventListeners();
          loadFilters();
          loadData();
        });

        function initEventListeners() {
          const btnRefresh = document.getElementById('btnRefresh');
          if (btnRefresh) {
            btnRefresh.addEventListener('click', function() {
              loadData();
            });
          }
          
          const btnProcessEvaluations = document.getElementById('btnProcessEvaluations');
          if (btnProcessEvaluations) {
            btnProcessEvaluations.addEventListener('click', function() {
              processEvaluations();
            });
          }
          
          const filterTaf = document.getElementById('filterTaf');
          if (filterTaf) filterTaf.addEventListener('change', filterData);
          
          const filterClass = document.getElementById('filterClass');
          if (filterClass) filterClass.addEventListener('change', filterData);
          
          const filterProgram = document.getElementById('filterProgram');
          if (filterProgram) filterProgram.addEventListener('change', filterData);
        }

        async function loadFilters() {
          try {
            // Load TAFs
            const tafsRes = await fetch('/api/tafs');
            const tafsData = await tafsRes.json();
            if (tafsData.success) {
              tafs = tafsData.tafs || [];
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

            // Load Classes
            const classesRes = await fetch('/api/classes');
            const classesData = await classesRes.json();
            if (classesData.success) {
              classes = classesData.classes || [];
              const select = document.getElementById('filterClass');
              if (select) {
                classes.forEach(cls => {
                  select.add(new Option(cls.title || cls.code, cls.id));
                });
              }
            }

            // Load Programs
            const programsRes = await fetch('/api/programs');
            const programsData = await programsRes.json();
            if (programsData.success) {
              programs = programsData.programs || [];
              const select = document.getElementById('filterProgram');
              if (select) {
                programs.forEach(prog => {
                  select.add(new Option(prog.title, prog.id));
                });
              }
            }
          } catch (error) {
            console.error('Filters error:', error);
          }
        }

        async function loadData() {
          try {
            const tbody = document.getElementById('tableBody');
            if (tbody) {
              tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></td></tr>';
            }
            
            const response = await fetch('/api/taf-feedbacks/ranking');
            const result = await response.json();
            
            if (result.success) {
              feedbacksData = result.rankings || [];
              filteredData = [...feedbacksData];
              renderTable();
            } else {
              showError('Erreur lors du chargement: ' + (result.error || 'Erreur inconnue'));
              if (tbody) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-danger">Erreur lors du chargement</td></tr>';
              }
            }
          } catch (error) {
            console.error('Load error:', error);
            showError('Erreur: ' + error.message);
            const tbody = document.getElementById('tableBody');
            if (tbody) {
              tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-danger">Erreur: ' + error.message + '</td></tr>';
            }
          }
        }

        function renderTable() {
          const tbody = document.getElementById('tableBody');
          
          if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">Aucun feedback trouvé</td></tr>';
            return;
          }

          let html = '';
          filteredData.forEach(function(item, index) {
            const rank = index + 1;
            const rankBadge = rank === 1 ? '<span class="badge bg-warning text-dark">🥇 1er</span>' :
                             rank === 2 ? '<span class="badge bg-secondary">🥈 2ème</span>' :
                             rank === 3 ? '<span class="badge bg-warning">🥉 3ème</span>' :
                             '<span class="badge bg-light text-dark">#' + rank + '</span>';
            
            const lastSubmission = item.last_submission ? new Date(item.last_submission).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A';

            html += '<tr>';
            html += '<td>' + rankBadge + '</td>';
            html += '<td><strong>' + escapeHtml(item.class_name || item.class_code || 'N/A') + '</strong></td>';
            html += '<td>' + escapeHtml(item.taf_title || 'TAF #' + item.taf_id) + '</td>';
            html += '<td>' + escapeHtml(item.program_name || 'N/A') + '</td>';
            html += '<td><span class="badge bg-primary">' + (item.feedback_count || 0) + '</span></td>';
            html += '<td><span class="badge bg-info">Classé par nombre</span></td>';
            html += '<td><small class="text-muted">' + lastSubmission + '</small></td>';
            html += '<td>';
            html += '<a href="/feedbacks/class/' + item.class_id + '" class="btn btn-outline-info btn-sm" title="Voir les feedbacks">';
            html += '<i class="bi bi-eye"></i>';
            html += '</a>';
            html += '</td>';
            html += '</tr>';
          });
          
          tbody.innerHTML = html;
        }

        function filterData() {
          const tafId = document.getElementById('filterTaf').value;
          const classId = document.getElementById('filterClass').value;
          const programId = document.getElementById('filterProgram').value;

          filteredData = feedbacksData.filter(function(item) {
            return (!tafId || item.taf_id == tafId) &&
                   (!classId || item.class_id == classId) &&
                   (!programId || item.program_id == programId);
          });

          renderTable();
        }

        function escapeHtml(text) {
          if (!text) return '';
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        }

        async function processEvaluations() {
          const btn = document.getElementById('btnProcessEvaluations');
          const originalText = btn.innerHTML;
          
          try {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Traitement en cours...';
            
            const response = await fetch('/jobs/feedback/evaluation');
            const result = await response.json();
            
            const batchSize = result.batch_size || 50;
            showInfo('Traitement en cours... Traitement de ' + batchSize + ' feedbacks...');
            
            if (result.success) {
              let message = 'Traitement terminé: ' + result.processed + ' feedback(s) traité(s)';
              if (result.approved > 0 || result.needs_revision > 0) {
                message += ' (' + result.approved + ' approuvé(s), ' + result.needs_revision + ' nécessitant révision)';
              }
              
              if (result.errors && result.errors.length > 0) {
                message += '. ' + result.errors.length + ' erreur(s) rencontrée(s).';
              }
              
              showSuccess(message);
              
              // Si des feedbacks ont été traités, recharger les données
              if (result.processed > 0) {
                setTimeout(function() {
                  loadData();
                }, 1000);
              }
              
              // Si il reste des feedbacks à traiter, proposer de continuer
              if (result.processed === batchSize) {
                setTimeout(function() {
                  if (confirm(batchSize + ' feedbacks traités. Voulez-vous continuer le traitement ?')) {
                    processEvaluations();
                  }
                }, 2000);
              }
            } else {
              showError('Erreur lors du traitement: ' + (result.error || 'Erreur inconnue'));
            }
          } catch (error) {
            console.error('Error processing evaluations:', error);
            showError('Erreur: ' + error.message);
          } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
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

        function showInfo(message) {
          const container = document.getElementById('alertContainer');
          container.innerHTML = '<div class="alert alert-info alert-dismissible fade show" role="alert">' +
            escapeHtml(message) +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
      })();
    </script>
  `;

  return getAdminLayout('Classement TAF Feedbacks', content, '/tafs', user);
}

