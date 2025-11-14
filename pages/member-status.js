// ===== PAGE MEMBER STATUS - Admin MBA =====
// Page de gestion des statuts des membres (activer, désactiver, bannir)

import { getAdminLayout } from '../templates/layout.js';

export function getMemberStatusPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Gestion des Statuts des Membres</h1>
        <p class="text-muted mb-0">Activer, désactiver ou bannir des membres</p>
      </div>
      <div class="d-flex gap-2">
        <a href="/members" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Retour aux Membres
        </a>
        <button class="btn btn-outline-primary" onclick="refreshMembers()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Filters -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <label for="searchMembers" class="form-label">Rechercher</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" id="searchMembers" placeholder="Nom, email, téléphone...">
        </div>
      </div>
      <div class="col-md-3">
        <label for="statusFilter" class="form-label">Statut</label>
        <select class="form-select" id="statusFilter">
          <option value="">Tous les statuts</option>
          <option value="1">Actif</option>
          <option value="0">Inactif</option>
          <option value="9">Banni</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="schoolFilter" class="form-label">École</label>
        <select class="form-select" id="schoolFilter">
          <option value="">Toutes les écoles</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="programFilter" class="form-label">Programme</label>
        <select class="form-select" id="programFilter">
          <option value="">Tous les programmes</option>
        </select>
      </div>
    </div>

    <!-- Members Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Liste des Membres</h5>
          </div>
          <div class="col-auto">
            <span class="badge bg-primary" id="totalMembers">0 membres</span>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut Actuel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="membersTableBody">
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

    <!-- Status Change Modal -->
    <div class="modal fade" id="statusModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="statusModalTitle">Changer le Statut</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="statusForm">
              <input type="hidden" id="memberId" value="">
              <input type="hidden" id="currentStatus" value="">
              
              <div class="mb-3">
                <label class="form-label">Membre</label>
                <p class="form-control-plaintext" id="memberInfo">-</p>
              </div>
              
              <div class="mb-3">
                <label for="newStatus" class="form-label">Nouveau Statut *</label>
                <select class="form-select" id="newStatus" required>
                  <option value="">Sélectionner un statut</option>
                  <option value="1">Actif</option>
                  <option value="0">Inactif</option>
                  <option value="9">Banni</option>
                </select>
                <div class="form-text">
                  <strong>Actif (1):</strong> Membre peut se connecter et accéder aux ressources<br>
                  <strong>Inactif (0):</strong> Membre désactivé, ne peut pas se connecter<br>
                  <strong>Banni (9):</strong> Membre banni, accès refusé de manière permanente
                </div>
              </div>
              
              <div class="mb-3">
                <label for="statusNote" class="form-label">Note (optionnel)</label>
                <textarea class="form-control" id="statusNote" rows="3" placeholder="Raison du changement de statut..."></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveStatusChange()">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div class="modal fade" id="historyModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Historique des Changements de Statut</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div id="historyContent">
              <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let members = [];
    let schools = [];
    let programs = [];

    function showAlert(message, type) {
      const alertDiv = document.getElementById('alert');
      if (alertDiv) {
        alertDiv.className = 'alert alert-' + type;
        alertDiv.textContent = message;
        alertDiv.classList.remove('d-none');
        
        setTimeout(function() {
          alertDiv.classList.add('d-none');
        }, 5000);
      }
    }

    // Load data on page load
    document.addEventListener('DOMContentLoaded', async function() {
      console.log('🚀 DOMContentLoaded - Starting initialization');
      try {
        console.log('📚 Loading schools and programs...');
        await Promise.all([
          loadSchools(),
          loadPrograms()
        ]);
        console.log('✅ Schools and programs loaded');
        console.log('👥 Loading members...');
        await loadMembers();
        console.log('✅ Initialization complete');
      } catch (error) {
        console.error('❌ Error initializing page:', error);
        showAlert('Erreur lors de l\'initialisation: ' + error.message, 'danger');
      }
      
      // Event listeners
      const searchInput = document.getElementById('searchMembers');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          filterMembers();
        });
      }
      
      const statusFilter = document.getElementById('statusFilter');
      if (statusFilter) {
        statusFilter.addEventListener('change', function() {
          filterMembers();
        });
      }
      
      const schoolFilter = document.getElementById('schoolFilter');
      if (schoolFilter) {
        schoolFilter.addEventListener('change', function() {
          filterMembers();
        });
      }
      
      const programFilter = document.getElementById('programFilter');
      if (programFilter) {
        programFilter.addEventListener('change', function() {
          filterMembers();
        });
      }
    });

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
          const select = document.getElementById('schoolFilter');
          select.innerHTML = '<option value="">Toutes les écoles</option>';
          schools.forEach(school => {
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
        const result = await response.json();
        
        if (result.success) {
          programs = result.programs;
          const select = document.getElementById('programFilter');
          select.innerHTML = '<option value="">Tous les programmes</option>';
          programs.forEach(program => {
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

    async function loadMembers() {
      console.log('🔵 loadMembers() called');
      try {
        const tbody = document.getElementById('membersTableBody');
        if (!tbody) {
          console.error('❌ membersTableBody not found');
          return;
        }
        
        console.log('✅ tbody found, showing spinner');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></td></tr>';
        
        const search = document.getElementById('searchMembers').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const schoolFilter = document.getElementById('schoolFilter').value;
        const programFilter = document.getElementById('programFilter').value;
        
        let url = '/api/members?limit=100';
        if (search) url += '&search=' + encodeURIComponent(search);
        if (schoolFilter) url += '&school_id=' + schoolFilter;
        if (programFilter) url += '&program_id=' + programFilter;
        if (statusFilter) url += '&status=' + statusFilter;
        
        console.log('🌐 Fetching URL:', url);
        const response = await fetch(url);
        console.log('📡 Response status:', response.status, response.ok);
        
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        
        const result = await response.json();
        console.log('📦 API result:', { success: result.success, membersCount: result.members ? result.members.length : 0, hasMembers: !!result.members });
        
        if (result.success && result.members && Array.isArray(result.members)) {
          members = result.members;
          console.log('✅ Members loaded:', members.length);
          renderMembers();
          updateTotalCount();
        } else {
          console.error('❌ API error or no members:', result);
          showAlert('Erreur lors du chargement des membres: ' + (result.error || 'Aucun membre trouvé'), 'danger');
          tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-danger">Erreur: ' + (result.error || 'Aucun membre trouvé') + '</td></tr>';
        }
      } catch (error) {
        console.error('❌ Error loading members:', error);
        showAlert('Erreur: ' + error.message, 'danger');
        const tbody = document.getElementById('membersTableBody');
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-danger">Erreur: ' + error.message + '</td></tr>';
        }
      }
    }

    function filterMembers() {
      loadMembers();
    }

    function renderMembers() {
      console.log('🟢 renderMembers() called with', members.length, 'members');
      const tbody = document.getElementById('membersTableBody');
      if (!tbody) {
        console.error('❌ tbody not found in renderMembers');
        return;
      }
      
      tbody.innerHTML = '';
      
      if (members.length === 0) {
        console.log('⚠️ No members to render');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Aucun membre trouvé</td></tr>';
        return;
      }
      
      console.log('🎨 Rendering', members.length, 'members');
      members.forEach((member, index) => {
        try {
          const row = document.createElement('tr');
          
          const statusBadge = getStatusBadge(member.is_active);
          const statusActions = getStatusActions(member);
          
          row.innerHTML = \`
            <td>\${member.id}</td>
            <td>\${escapeHtml(member.first_name || '')} \${escapeHtml(member.last_name || '')}</td>
            <td>\${escapeHtml(member.email || '')}</td>
            <td>\${escapeHtml(member.phone || '-')}</td>
            <td>\${statusBadge}</td>
            <td>\${statusActions}</td>
          \`;
          
          tbody.appendChild(row);
        } catch (error) {
          console.error('❌ Error rendering member', index, ':', error);
        }
      });
      console.log('✅ Members rendered successfully');
    }

    function getStatusBadge(isActive) {
      if (isActive === 1) {
        return '<span class="badge bg-success">Actif</span>';
      } else if (isActive === 0) {
        return '<span class="badge bg-secondary">Inactif</span>';
      } else if (isActive === 9) {
        return '<span class="badge bg-danger">Banni</span>';
      }
      return '<span class="badge bg-secondary">Inconnu</span>';
    }

    function getStatusActions(member) {
      const firstName = escapeHtml(member.first_name || '');
      const lastName = escapeHtml(member.last_name || '');
      const email = escapeHtml(member.email || '');
      
      return \`
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="showStatusModal(\${member.id}, '\${firstName}', '\${lastName}', '\${email}', \${member.is_active || 0})" title="Changer le statut">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-info" onclick="showHistory(\${member.id})" title="Voir l'historique">
            <i class="bi bi-clock-history"></i>
          </button>
        </div>
      \`;
    }

    function showStatusModal(memberId, firstName, lastName, email, currentStatus) {
      document.getElementById('memberId').value = memberId;
      document.getElementById('currentStatus').value = currentStatus;
      document.getElementById('memberInfo').textContent = firstName + ' ' + lastName + ' (' + email + ')';
      document.getElementById('newStatus').value = '';
      document.getElementById('statusNote').value = '';
      
      const modal = new bootstrap.Modal(document.getElementById('statusModal'));
      modal.show();
    }

    async function saveStatusChange() {
      const memberId = document.getElementById('memberId').value;
      const newStatus = document.getElementById('newStatus').value;
      const note = document.getElementById('statusNote').value;
      
      if (!newStatus) {
        showAlert('Veuillez sélectionner un nouveau statut', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/member-status/' + memberId, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            new_status: parseInt(newStatus),
            note: note || null
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('statusModal')).hide();
          loadMembers();
        } else {
          showAlert(result.error || 'Erreur lors du changement de statut', 'danger');
        }
      } catch (error) {
        console.error('Error changing status:', error);
        showAlert('Erreur: ' + error.message, 'danger');
      }
    }

    async function showHistory(memberId) {
      const historyContent = document.getElementById('historyContent');
      historyContent.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></div>';
      
      const modal = new bootstrap.Modal(document.getElementById('historyModal'));
      modal.show();
      
      try {
        const response = await fetch('/api/member-status/' + memberId);
        const result = await response.json();
        
        if (result.success) {
          const history = result.history || [];
          
          if (history.length === 0) {
            historyContent.innerHTML = '<p class="text-muted text-center">Aucun historique disponible</p>';
            return;
          }
          
          let html = '<div class="table-responsive"><table class="table table-sm">';
          html += '<thead><tr><th>Date</th><th>Action</th><th>Ancien Statut</th><th>Nouveau Statut</th><th>Admin</th><th>Note</th></tr></thead><tbody>';
          
          history.forEach(item => {
            const statusNames = { 0: 'Inactif', 1: 'Actif', 9: 'Banni' };
            const actionNames = { 'activate': 'Activer', 'deactivate': 'Désactiver', 'ban': 'Bannir', 'unban': 'Débannir' };
            const actionBadges = { 'activate': 'bg-success', 'deactivate': 'bg-secondary', 'ban': 'bg-danger', 'unban': 'bg-info' };
            
            html += '<tr>';
            html += '<td>' + new Date(item.created_at).toLocaleString('fr-FR') + '</td>';
            html += '<td><span class="badge ' + (actionBadges[item.action] || 'bg-secondary') + '">' + (actionNames[item.action] || item.action) + '</span></td>';
            html += '<td><span class="badge bg-secondary">' + (statusNames[item.old_status] || item.old_status) + '</span></td>';
            html += '<td><span class="badge ' + (item.new_status === 1 ? 'bg-success' : item.new_status === 9 ? 'bg-danger' : 'bg-secondary') + '">' + (statusNames[item.new_status] || item.new_status) + '</span></td>';
            html += '<td>' + escapeHtml(item.admin_username || item.admin_email || 'N/A') + '</td>';
            html += '<td>' + escapeHtml(item.note || '-') + '</td>';
            html += '</tr>';
          });
          
          html += '</tbody></table></div>';
          historyContent.innerHTML = html;
        } else {
          historyContent.innerHTML = '<p class="text-danger text-center">Erreur lors du chargement de l\'historique</p>';
        }
      } catch (error) {
        console.error('Error loading history:', error);
        historyContent.innerHTML = '<p class="text-danger text-center">Erreur: ' + error.message + '</p>';
      }
    }

    function updateTotalCount() {
      const totalEl = document.getElementById('totalMembers');
      if (totalEl) {
        totalEl.textContent = members.length + ' membres';
      }
    }

    function refreshMembers() {
      loadMembers();
    }

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Make functions globally accessible
    window.showStatusModal = showStatusModal;
    window.saveStatusChange = saveStatusChange;
    window.showHistory = showHistory;
    window.refreshMembers = refreshMembers;
    window.filterMembers = filterMembers;
  `;

  return getAdminLayout('Gestion des Statuts', content, '/members', user) + `<script>${scripts}</script>`;
}

