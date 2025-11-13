// ===== PAGE RÉCLAMATIONS - Admin MBA =====
// Page de gestion des réclamations

import { getAdminLayout } from '../templates/layout.js';

export function getReclamationsPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Gestion des Réclamations</h1>
        <p class="text-muted mb-0">Consulter et gérer les réclamations des membres</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshReclamations()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label for="statusFilter" class="form-label">Statut</label>
            <select class="form-select" id="statusFilter" onchange="filterReclamations()">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="programFilter" class="form-label">Programme Membre</label>
            <select class="form-select" id="programFilter" onchange="filterReclamations()">
              <option value="">Tous les programmes</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="classFilter" class="form-label">Classe Membre</label>
            <select class="form-select" id="classFilter" onchange="filterReclamations()">
              <option value="">Toutes les classes</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="searchInput" class="form-label">Rechercher</label>
            <input type="text" class="form-control" id="searchInput" placeholder="Nom, email, sujet..." onkeyup="filterReclamations()">
          </div>
        </div>
      </div>
    </div>

    <!-- Réclamations Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Liste des Réclamations</h5>
          </div>
          <div class="col-auto">
            <span class="badge bg-primary" id="totalReclamations">0 réclamations</span>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>ID Membre</th>
                <th>RC Program</th>
                <th>Membre Program</th>
                <th>Classe</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Sujet</th>
                <th>Réclamation</th>
                <th>Statut</th>
                <th>Note</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="reclamationsTableBody">
              <tr>
                <td colspan="14" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                  </div>
                  <p class="mt-2 text-muted">Chargement des réclamations...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Status Modal -->
    <div class="modal fade" id="editStatusModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifier le statut</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="editStatusForm">
              <input type="hidden" id="reclamationId">
              
              <div class="mb-3">
                <label for="reclamationStatus" class="form-label">Statut</label>
                <select class="form-select" id="reclamationStatus" required>
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label for="reclamationNote" class="form-label">Note</label>
                <textarea class="form-control" id="reclamationNote" rows="3" placeholder="Ajouter une note..."></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" onclick="saveStatus()">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let reclamations = [];
    let programs = [];
    let filteredReclamations = [];

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadPrograms();
      loadClasses();
      loadReclamations();
    });

    async function loadPrograms() {
      try {
        const response = await fetch('/api/programs');
        const result = await response.json();
        
        if (result.success) {
          programs = result.programs;
          const programSelect = document.getElementById('programFilter');
          
          programs.forEach(program => {
            const option = document.createElement('option');
            option.value = program.title;
            option.textContent = program.title;
            programSelect.appendChild(option);
          });
        }
      } catch (error) {
        console.error('Error loading programs:', error);
      }
    }

    async function loadClasses() {
      try {
        const response = await fetch('/api/classes');
        const result = await response.json();
        
        if (result.success) {
          const classes = result.classes;
          const classSelect = document.getElementById('classFilter');
          
          // Récupérer les classes uniques et les trier
          const uniqueClasses = [...new Set(classes.map(c => c.code).filter(c => c))].sort();
          
          uniqueClasses.forEach(classCode => {
            const option = document.createElement('option');
            option.value = classCode;
            option.textContent = classCode;
            classSelect.appendChild(option);
          });
        }
      } catch (error) {
        console.error('Error loading classes:', error);
      }
    }

    async function loadReclamations() {
      try {
        const response = await fetch('/api/reclamations');
        const result = await response.json();
        
        if (result.success) {
          reclamations = result.reclamations;
          filteredReclamations = [...reclamations];
          renderReclamationsTable();
          updateTotalCount();
        } else {
          showAlert('Erreur lors du chargement des réclamations', 'danger');
        }
      } catch (error) {
        console.error('Error loading reclamations:', error);
        showAlert('Erreur lors du chargement des réclamations', 'danger');
      }
    }

    function filterReclamations() {
      const statusFilter = document.getElementById('statusFilter').value;
      const programFilter = document.getElementById('programFilter').value;
      const classFilter = document.getElementById('classFilter').value;
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      
      filteredReclamations = reclamations.filter(rec => {
        const matchStatus = !statusFilter || rec.status === statusFilter;
        
        // Filtrer par programme du membre
        const matchProgram = !programFilter || 
          (rec.membre_programs && rec.membre_programs.includes(programFilter));
        
        // Filtrer par classe du membre
        const matchClass = !classFilter || 
          (rec.membre_classes && rec.membre_classes.includes(classFilter));
        
        const matchSearch = !searchTerm || 
          (rec.nom && rec.nom.toLowerCase().includes(searchTerm)) ||
          (rec.prenom && rec.prenom.toLowerCase().includes(searchTerm)) ||
          (rec.email && rec.email.toLowerCase().includes(searchTerm)) ||
          (rec.sujet && rec.sujet.toLowerCase().includes(searchTerm)) ||
          (rec.reclamation && rec.reclamation.toLowerCase().includes(searchTerm));
        
        return matchStatus && matchProgram && matchClass && matchSearch;
      });
      
      renderReclamationsTable();
      updateTotalCount();
    }

    function renderReclamationsTable() {
      const tbody = document.getElementById('reclamationsTableBody');
      
      if (filteredReclamations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" class="text-center py-4 text-muted">Aucune réclamation trouvée</td></tr>';
        return;
      }
      
      tbody.innerHTML = filteredReclamations.map(rec => {
        const statusBadge = getStatusBadge(rec.status);
        const fullName = \`\${rec.prenom || ''} \${rec.nom || ''}\`.trim() || 'N/A';
        
        // Format programmes du membre
        let membreProgramsDisplay = '-';
        if (rec.membre_programs) {
          const programs = rec.membre_programs.split(',').map(p => p.trim()).filter(p => p);
          if (programs.length > 0) {
            membreProgramsDisplay = programs.slice(0, 2).map(program => 
              \`<span class="badge bg-primary me-1">\${program}</span>\`
            ).join('');
            if (programs.length > 2) {
              membreProgramsDisplay += \`<span class="badge bg-secondary">+\${programs.length - 2}</span>\`;
            }
          }
        }
        
        // Format classes du membre
        let membreClassesDisplay = '-';
        if (rec.membre_classes) {
          const classes = rec.membre_classes.split(',').map(c => c.trim()).filter(c => c);
          if (classes.length > 0) {
            membreClassesDisplay = classes.slice(0, 2).map(classCode => 
              \`<span class="badge bg-info me-1">\${classCode}</span>\`
            ).join('');
            if (classes.length > 2) {
              membreClassesDisplay += \`<span class="badge bg-secondary">+\${classes.length - 2}</span>\`;
            }
          }
        }
        
        // Format programme de la réclamation (RC Program)
        let rcProgramDisplay = '-';
        if (rec.program_title) {
          rcProgramDisplay = \`<span class="badge bg-warning">\${rec.program_title}</span>\`;
        }
        
        return \`
          <tr>
            <td><span class="badge bg-secondary">#\${rec.id}</span></td>
            <td>
              \${rec.membre_id ? \`<a href="/members?search=\${rec.membre_id}" class="text-decoration-none"><span class="badge bg-success">#\${rec.membre_id}</span></a>\` : '<span class="text-muted">-</span>'}
            </td>
            <td>\${rcProgramDisplay}</td>
            <td>\${membreProgramsDisplay}</td>
            <td>\${membreClassesDisplay}</td>
            <td>\${fullName}</td>
            <td>
              <a href="mailto:\${rec.email}" class="text-decoration-none">\${rec.email}</a>
            </td>
            <td>\${rec.telephone || '-'}</td>
            <td>\${rec.sujet || '-'}</td>
            <td>
              <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="\${rec.reclamation || ''}">
                \${rec.reclamation ? (rec.reclamation.substring(0, 50) + (rec.reclamation.length > 50 ? '...' : '')) : '-'}
              </div>
            </td>
            <td>\${statusBadge}</td>
            <td>
              \${rec.note ? \`<span class="text-muted" title="\${rec.note}">\${rec.note.substring(0, 30)}\${rec.note.length > 30 ? '...' : ''}</span>\` : '-'}
            </td>
            <td>\${new Date(rec.created_at).toLocaleDateString('fr-FR')}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" onclick="editStatus(\${rec.id})" title="Modifier le statut">
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function getStatusBadge(status) {
      const badges = {
        'pending': '<span class="badge bg-warning">En attente</span>',
        'in_progress': '<span class="badge bg-info">En cours</span>',
        'resolved': '<span class="badge bg-success">Résolu</span>',
        'closed': '<span class="badge bg-secondary">Fermé</span>'
      };
      return badges[status] || '<span class="badge bg-secondary">\${status}</span>';
    }

    function editStatus(id) {
      const rec = reclamations.find(r => r.id === id);
      if (!rec) return;
      
      document.getElementById('reclamationId').value = rec.id;
      document.getElementById('reclamationStatus').value = rec.status || 'pending';
      document.getElementById('reclamationNote').value = rec.note || '';
      
      const modal = new bootstrap.Modal(document.getElementById('editStatusModal'));
      modal.show();
    }

    async function saveStatus() {
      const id = document.getElementById('reclamationId').value;
      const status = document.getElementById('reclamationStatus').value;
      const note = document.getElementById('reclamationNote').value;
      
      try {
        const response = await fetch('/api/reclamations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, note })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('Statut mis à jour avec succès', 'success');
          bootstrap.Modal.getInstance(document.getElementById('editStatusModal')).hide();
          loadReclamations();
        } else {
          showAlert(result.error || 'Erreur lors de la mise à jour', 'danger');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        showAlert('Erreur lors de la mise à jour', 'danger');
      }
    }

    function updateTotalCount() {
      document.getElementById('totalReclamations').textContent = \`\${filteredReclamations.length} réclamation\${filteredReclamations.length > 1 ? 's' : ''}\`;
    }

    function refreshReclamations() {
      loadReclamations();
      showAlert('Réclamations actualisées', 'info');
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
    window.refreshReclamations = refreshReclamations;
    window.filterReclamations = filterReclamations;
    window.editStatus = editStatus;
    window.saveStatus = saveStatus;
  `;

  return getAdminLayout('Réclamations', content, '/reclamations', user) + `<script>${scripts}</script>`;
}

