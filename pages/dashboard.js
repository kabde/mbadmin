// ===== PAGE DASHBOARD - Admin MBA =====
// Page de tableau de bord avec statistiques

import { getAdminLayout } from '../templates/layout.js';

export function getDashboardPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Tableau de Bord</h1>
        <p class="text-muted mb-0">Statistiques générales et par programme</p>
      </div>
      <button class="btn btn-outline-primary" onclick="loadDashboard()">
        <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
      </button>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Global Stats Cards -->
    <div class="row g-3 mb-4" id="globalStatsCards">
      <!-- Stats cards will be loaded here -->
    </div>

    <!-- Statistics by Program -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <h5 class="card-title mb-0">Statistiques par Programme</h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Programme</th>
                <th class="text-end">Total Membres</th>
                <th class="text-end">Membres Actifs</th>
                <th class="text-end">Taux d'Activité</th>
              </tr>
            </thead>
            <tbody id="statsTableBody">
              <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                  <i class="bi bi-arrow-repeat spin me-2"></i>Chargement...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let dashboardData = {
      stats: {
        byProgram: [],
        global: {}
      }
    };

    async function loadDashboard() {
      try {
        showLoading();
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        if (data.success) {
          dashboardData = data;
          renderDashboard();
        } else {
          showAlert('Erreur lors du chargement des statistiques', 'danger');
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Erreur lors du chargement des statistiques', 'danger');
      }
    }

    function renderDashboard() {
      renderGlobalStats();
      renderProgramStats();
    }

    function renderGlobalStats() {
      const global = dashboardData.stats.global || {};
      const cardsContainer = document.getElementById('globalStatsCards');
      
      const totalMembers = global.total_members_all || 0;
      const activeMembers = global.total_active_members_all || 0;
      const totalPrograms = global.total_programs || 0;
      const activityRate = totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : 0;

      cardsContainer.innerHTML = \`
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-primary bg-opacity-10 rounded p-3">
                    <i class="bi bi-people fs-4 text-primary"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="text-muted mb-1">Total Membres</h6>
                  <h3 class="mb-0">\${totalMembers.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-success bg-opacity-10 rounded p-3">
                    <i class="bi bi-person-check fs-4 text-success"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="text-muted mb-1">Membres Actifs</h6>
                  <h3 class="mb-0">\${activeMembers.toLocaleString()}</h3>
                  <small class="text-muted">15 derniers jours</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-info bg-opacity-10 rounded p-3">
                    <i class="bi bi-graph-up fs-4 text-info"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="text-muted mb-1">Taux d'Activité</h6>
                  <h3 class="mb-0">\${activityRate}%</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-warning bg-opacity-10 rounded p-3">
                    <i class="bi bi-book fs-4 text-warning"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="text-muted mb-1">Programmes</h6>
                  <h3 class="mb-0">\${totalPrograms}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderProgramStats() {
      const tbody = document.getElementById('statsTableBody');
      const programs = dashboardData.stats.byProgram || [];

      if (programs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Aucune donnée disponible</td></tr>';
        return;
      }

      tbody.innerHTML = programs.map(program => {
        const totalMembers = program.total_members || 0;
        const activeMembers = program.active_members || 0;
        const activityRate = totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : 0;
        
        let rateBadgeClass = 'bg-secondary';
        if (activityRate >= 20) rateBadgeClass = 'bg-success';
        else if (activityRate >= 10) rateBadgeClass = 'bg-warning';
        else if (activityRate > 0) rateBadgeClass = 'bg-danger';

        return \`
          <tr>
            <td>
              <strong>\${program.program_name || 'N/A'}</strong>
            </td>
            <td class="text-end">
              <span class="badge bg-primary">\${totalMembers.toLocaleString()}</span>
            </td>
            <td class="text-end">
              <span class="badge bg-success">\${activeMembers.toLocaleString()}</span>
            </td>
            <td class="text-end">
              <span class="badge \${rateBadgeClass}">\${activityRate}%</span>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function showLoading() {
      const tbody = document.getElementById('statsTableBody');
      tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted"><i class="bi bi-arrow-repeat spin me-2"></i>Chargement...</td></tr>';
    }

    function showAlert(message, type = 'info') {
      const alertDiv = document.getElementById('alert');
      alertDiv.className = \`alert alert-\${type} alert-dismissible fade show\`;
      alertDiv.innerHTML = \`
        \${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      \`;
      setTimeout(() => {
        alertDiv.classList.add('d-none');
      }, 5000);
    }

    // Load dashboard on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadDashboard();
    });

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin {
        animation: spin 1s linear infinite;
      }
    \`;
    document.head.appendChild(style);
  `;

  return getAdminLayout('Dashboard', content, '/dashboard', user) + `<script>${scripts}</script>`;
}

