import { getAdminLayout } from '../templates/layout.js';

export function getTafsPage(user) {
  const content = `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1">Gestion des Travaux à Faire (TAF)</h1>
          <p class="text-muted mb-0">Créez et gérez les travaux à faire pour vos programmes</p>
        </div>
        <div class="d-flex gap-2">
          <a href="/tafs/feedbacks" class="btn btn-info">
            <i class="bi bi-trophy me-2"></i>Classement par Classe
          </a>
          <a href="/tafs/add" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Nouveau TAF
          </a>
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
                  <h6 class="card-title mb-1">Total TAFs</h6>
                  <h3 class="mb-0" id="statTotal">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-list-check fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">Publiés</h6>
                  <h3 class="mb-0" id="statPublished">0</h3>
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
                  <h3 class="mb-0" id="statActive">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-clock-history fs-1 opacity-75"></i>
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
                  <h6 class="card-title mb-1">À Venir</h6>
                  <h3 class="mb-0" id="statUpcoming">0</h3>
                </div>
                <div class="flex-shrink-0">
                  <i class="bi bi-calendar-event fs-1 opacity-75"></i>
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
              <label for="filterSchool" class="form-label">École</label>
              <select class="form-select" id="filterSchool">
                <option value="">Toutes</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="filterProgram" class="form-label">Programme</label>
              <select class="form-select" id="filterProgram">
                <option value="">Tous</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="filterStatus" class="form-label">Statut</label>
              <select class="form-select" id="filterStatus">
                <option value="">Tous</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="filterSearch" class="form-label">Rechercher</label>
              <input type="text" class="form-control" id="filterSearch" placeholder="Titre...">
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Liste des TAFs</h5>
            <button type="button" class="btn btn-outline-secondary btn-sm" id="btnRefresh">
              <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>École</th>
                  <th>Programme</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Langues</th>
                  <th>Statut</th>
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
        
        let tafsData = [];
        let filteredData = [];

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
          console.log('TAFs page initialized');
          initEventListeners();
          loadData();
          loadFilters();
        });

        function initEventListeners() {
          const btnRefresh = document.getElementById('btnRefresh');
          if (btnRefresh) {
            btnRefresh.addEventListener('click', function() {
              loadData();
            });
          }
          
          const filterSchool = document.getElementById('filterSchool');
          if (filterSchool) filterSchool.addEventListener('change', filterData);
          
          const filterProgram = document.getElementById('filterProgram');
          if (filterProgram) filterProgram.addEventListener('change', filterData);
          
          const filterStatus = document.getElementById('filterStatus');
          if (filterStatus) filterStatus.addEventListener('change', filterData);
          
          const filterSearch = document.getElementById('filterSearch');
          if (filterSearch) filterSearch.addEventListener('keyup', filterData);
        }

        async function loadData() {
          try {
            const tbody = document.getElementById('tableBody');
            if (tbody) {
              tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></td></tr>';
            }
            
            const response = await fetch('/api/tafs');
            const result = await response.json();
            
            if (result.success) {
              tafsData = result.tafs || [];
              filteredData = [...tafsData];
              renderTable();
              updateStats();
            } else {
              showError('Erreur lors du chargement');
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

        async function loadFilters() {
          try {
            // Schools
            const schoolsRes = await fetch('/api/schools');
            const schoolsData = await schoolsRes.json();
            if (schoolsData.success) {
              const select = document.getElementById('filterSchool');
              if (select) {
                schoolsData.schools.forEach(s => {
                  select.add(new Option(s.name, s.id));
                });
              }
            }

            // Programs
            const programsRes = await fetch('/api/programs');
            const programsData = await programsRes.json();
            if (programsData.success) {
              const select = document.getElementById('filterProgram');
              if (select) {
                programsData.programs.forEach(p => {
                  select.add(new Option(p.title, p.id));
                });
              }
            }
          } catch (error) {
            console.error('Filters error:', error);
          }
        }

        function renderTable() {
          const tbody = document.getElementById('tableBody');
          
          if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">Aucun TAF</td></tr>';
            return;
          }

          let html = '';
          filteredData.forEach(function(taf) {
            const content = taf.content || {};
            const langs = Object.keys(content);
            const firstLang = langs[0] || 'fr';
            const title = content[firstLang]?.title || 'Sans titre';
            const subtitle = content[firstLang]?.subtitle || '';
            
            // Format dates correctly (avoid timezone issues)
            const startDateStr = taf.start_date.split('T')[0]; // Get YYYY-MM-DD part only
            const endDateStr = taf.end_date.split('T')[0];
            const startDateParts = startDateStr.split('-');
            const endDateParts = endDateStr.split('-');
            const startDate = startDateParts[2] + '/' + startDateParts[1] + '/' + startDateParts[0];
            const endDate = endDateParts[2] + '/' + endDateParts[1] + '/' + endDateParts[0];
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(taf.start_date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(taf.end_date);
            end.setHours(23, 59, 59, 999);
            const isActive = today >= start && today <= end;
            const isUpcoming = today < start;

            let langBadges = '';
            langs.forEach(function(lang) {
              const names = { fr: 'FR', ar: 'AR', en: 'EN', es: 'ES' };
              langBadges += '<span class="badge bg-secondary me-1">' + (names[lang] || lang.toUpperCase()) + '</span>';
            });

            const statusClass = taf.status === 'published' ? 'bg-success' : taf.status === 'draft' ? 'bg-warning' : 'bg-secondary';
            const statusText = taf.status === 'published' ? 'Publié' : taf.status === 'draft' ? 'Brouillon' : 'Archivé';
            const activeBadge = isActive ? '<span class="badge bg-info ms-1">En cours</span>' : '';
            const upcomingBadge = isUpcoming ? '<span class="badge bg-warning ms-1">À venir</span>' : '';

            html += '<tr>';
            html += '<td><h6 class="mb-0">' + escapeHtml(title) + '</h6><small class="text-muted">' + escapeHtml(subtitle) + '</small></td>';
            html += '<td>' + escapeHtml(taf.school_name || 'N/A') + '</td>';
            
            // Afficher tous les programmes associés
            let programsHtml = '';
            if (taf.programs && taf.programs.length > 0) {
              taf.programs.forEach(function(prog, index) {
                if (index > 0) programsHtml += ', ';
                programsHtml += '<span class="badge bg-primary me-1">' + escapeHtml(prog.program_name || 'N/A') + '</span>';
              });
            } else if (taf.program_name) {
              // Rétrocompatibilité
              programsHtml = '<span class="badge bg-primary">' + escapeHtml(taf.program_name) + '</span>';
            } else {
              programsHtml = '<span class="text-muted">N/A</span>';
            }
            html += '<td>' + programsHtml + '</td>';
            html += '<td>' + startDate + '</td>';
            html += '<td>' + endDate + '</td>';
            html += '<td>' + langBadges + '</td>';
            html += '<td><span class="badge ' + statusClass + '">' + statusText + '</span>' + activeBadge + upcomingBadge + '</td>';
            html += '<td>';
            html += '<div class="btn-group btn-group-sm">';
            html += '<button type="button" class="btn btn-outline-primary btn-view" data-id="' + taf.id + '" title="Voir"><i class="bi bi-eye"></i></button>';
            html += '<button type="button" class="btn btn-outline-secondary btn-edit" data-id="' + taf.id + '" title="Modifier"><i class="bi bi-pencil"></i></button>';
            html += '<button type="button" class="btn btn-outline-danger btn-delete" data-id="' + taf.id + '" title="Supprimer"><i class="bi bi-trash"></i></button>';
            html += '</div>';
            html += '</td>';
            html += '</tr>';
          });
          
          tbody.innerHTML = html;

          // Attach event listeners to action buttons
          tbody.querySelectorAll('.btn-view').forEach(function(btn) {
            btn.addEventListener('click', function() {
              const id = this.getAttribute('data-id');
              window.location.href = '/tafs/view/' + id;
            });
          });

          tbody.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
              const id = parseInt(this.getAttribute('data-id'));
              window.location.href = '/tafs/edit/' + id;
            });
          });

          tbody.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
              const id = parseInt(this.getAttribute('data-id'));
              deleteTaf(id);
            });
          });
        }

        function escapeHtml(text) {
          if (!text) return '';
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        }

        function updateStats() {
          const total = tafsData.length;
          const published = tafsData.filter(function(t) { return t.status === 'published'; }).length;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const active = tafsData.filter(function(t) {
            const start = new Date(t.start_date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(t.end_date);
            end.setHours(23, 59, 59, 999);
            return today >= start && today <= end;
          }).length;
          
          const upcoming = tafsData.filter(function(t) {
            const start = new Date(t.start_date);
            start.setHours(0, 0, 0, 0);
            return today < start;
          }).length;

          document.getElementById('statTotal').textContent = total;
          document.getElementById('statPublished').textContent = published;
          document.getElementById('statActive').textContent = active;
          document.getElementById('statUpcoming').textContent = upcoming;
        }

        function filterData() {
          const school = document.getElementById('filterSchool').value;
          const program = document.getElementById('filterProgram').value;
          const status = document.getElementById('filterStatus').value;
          const search = document.getElementById('filterSearch').value.toLowerCase();

          filteredData = tafsData.filter(function(taf) {
            const content = taf.content || {};
            const firstLang = Object.keys(content)[0] || 'fr';
            const title = (content[firstLang]?.title || '').toLowerCase();
            
            // Vérifier si le TAF est associé au programme filtré
            let matchesProgram = true;
            if (program) {
              if (taf.program_ids && Array.isArray(taf.program_ids)) {
                matchesProgram = taf.program_ids.includes(parseInt(program));
              } else {
                matchesProgram = taf.program_id == program;
              }
            }
            
            return (!school || taf.school_id == school) &&
                   matchesProgram &&
                   (!status || taf.status === status) &&
                   (!search || title.includes(search));
          });

          renderTable();
        }


        async function deleteTaf(id) {
          if (!confirm('Supprimer ce TAF ?')) return;

          try {
            const response = await fetch('/api/tafs/' + id, {
              method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
              showSuccess('TAF supprimé');
              loadData();
            } else {
              showError('Erreur lors de la suppression');
            }
          } catch (error) {
            console.error('Delete error:', error);
            showError('Erreur: ' + error.message);
          }
        }

        function showSuccess(message) {
          const container = document.getElementById('alertContainer');
          container.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
            message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
          setTimeout(function() {
            container.innerHTML = '';
          }, 5000);
        }

        function showError(message) {
          const container = document.getElementById('alertContainer');
          container.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
            message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
        }
      })();
    </script>
  `;

  return getAdminLayout('Gestion des TAFs', content, '/tafs', user);
}

