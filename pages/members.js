// ===== PAGE MEMBERS - Admin MBA =====
// Page de gestion des membres (étudiants)

import { getAdminLayout } from '../templates/layout.js';

export function getMembersPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Gestion des Membres</h1>
        <p class="text-muted mb-0">Gérer les étudiants et leurs informations</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshMembers()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
        <a href="/members/status" class="btn btn-warning">
          <i class="bi bi-shield-exclamation me-2"></i>Gérer les Statuts
        </a>
        <a href="/members/add" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Ajouter Membre
        </a>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Filters -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <label for="searchMembers" class="form-label">Rechercher</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" id="searchMembers" placeholder="Nom, email, téléphone...">
        </div>
      </div>
      <div class="col-md-3">
        <label for="schoolFilter" class="form-label">École</label>
        <select class="form-select" id="schoolFilter" onchange="filterMembers()">
          <option value="">Toutes les écoles</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="programFilter" class="form-label">Programme</label>
        <select class="form-select" id="programFilter" onchange="filterMembers()">
          <option value="">Tous les programmes</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="classFilter" class="form-label">Classe</label>
        <select class="form-select" id="classFilter" onchange="filterMembers()">
          <option value="">Toutes les classes</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="statusFilter" class="form-label">Statut</label>
        <select class="form-select" id="statusFilter" onchange="filterMembers()">
          <option value="">Tous les statuts</option>
          <option value="1">Actif</option>
          <option value="0">Inactif</option>
          <option value="9">Banni</option>
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
                <th>Photo</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>École</th>
                <th>Programmes</th>
                <th>Classes</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Champs Personnalisés</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="membersTableBody">
              <!-- Members will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-light">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <span class="text-muted" id="paginationInfo">Affichage de 0 à 0 sur 0</span>
          </div>
          <div>
            <nav>
              <ul class="pagination pagination-sm mb-0" id="pagination">
                <!-- Pagination will be loaded here -->
              </ul>
            </nav>
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
    let members = [];
    let schools = [];
    let programs = [];
    let classes = [];
    let deleteMemberId = null;
    let currentPage = 1;
    let totalPages = 1;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', async function() {
      await loadSchools();
      await loadPrograms();
      await loadClasses();
      setupEventListeners();
      handleUrlParams();
      
      // Ne pas charger les membres ici si il y a un paramètre class_id
      // car loadClasses() va s'en charger
      const urlParams = new URLSearchParams(window.location.search);
      const classId = urlParams.get('class_id');
      if (!classId) {
        loadMembers();
      }
    });

    function setupEventListeners() {
      // Search functionality
      document.getElementById('searchMembers').addEventListener('input', function(e) {
        currentPage = 1;
        loadMembers();
      });

      // Filter functionality
      document.getElementById('schoolFilter').addEventListener('change', function(e) {
        currentPage = 1;
        loadMembers();
      });

      document.getElementById('programFilter').addEventListener('change', function(e) {
        currentPage = 1;
        loadMembers();
      });

      document.getElementById('statusFilter').addEventListener('change', function(e) {
        currentPage = 1;
        loadMembers();
      });

      document.getElementById('classFilter').addEventListener('change', function(e) {
        currentPage = 1;
        loadMembers();
      });
    }

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
          populateSchoolSelect();
        }
      } catch (error) {
        console.error('Error loading schools:', error);
        showAlert('Erreur lors du chargement des écoles', 'danger');
      }
    }


    function populateSchoolSelect() {
      const select = document.getElementById('schoolFilter');
      select.innerHTML = '<option value="">Toutes les écoles</option>';
      
      schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        select.appendChild(option);
      });
    }

    async function loadPrograms() {
      try {
        const response = await fetch('/api/programs');
        const result = await response.json();
        
        if (result.success) {
          programs = result.programs;
          populateProgramSelect();
        }
      } catch (error) {
        console.error('Error loading programs:', error);
        showAlert('Erreur lors du chargement des programmes', 'danger');
      }
    }

    function populateProgramSelect() {
      const select = document.getElementById('programFilter');
      select.innerHTML = '<option value="">Tous les programmes</option>';
      
      programs.forEach(program => {
        const option = document.createElement('option');
        option.value = program.id;
        option.textContent = program.title;
        select.appendChild(option);
      });
    }

    async function loadClasses() {
      try {
        const response = await fetch('/api/classes');
        const result = await response.json();
        
        if (result.success) {
          classes = result.classes;
          populateClassSelect();
          
          // Après avoir chargé les classes, vérifier s'il y a un paramètre class_id dans l'URL
          const urlParams = new URLSearchParams(window.location.search);
          const classId = urlParams.get('class_id');
          if (classId) {
            console.log('Setting class filter after classes loaded:', classId);
            const classSelect = document.getElementById('classFilter');
            if (classSelect) {
              classSelect.value = classId;
              loadMembers();
            }
          }
        }
      } catch (error) {
        console.error('Error loading classes:', error);
        showAlert('Erreur lors du chargement des classes', 'danger');
      }
    }

    function populateClassSelect() {
      const select = document.getElementById('classFilter');
      select.innerHTML = '<option value="">Toutes les classes</option>';
      
      classes.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.id;
        option.textContent = \`\${classItem.code} - \${classItem.title}\`;
        select.appendChild(option);
      });
    }


    async function loadMembers() {
      try {
        const search = document.getElementById('searchMembers').value;
        const schoolId = document.getElementById('schoolFilter').value;
        const programId = document.getElementById('programFilter').value;
        const classId = document.getElementById('classFilter').value;
        const status = document.getElementById('statusFilter').value;
        
        let url = \`/api/members?page=\${currentPage}&limit=50\`;
        
        if (search) url += \`&search=\${encodeURIComponent(search)}\`;
        if (schoolId) url += \`&school_id=\${schoolId}\`;
        if (programId) url += \`&program_id=\${programId}\`;
        if (classId) url += \`&class_id=\${classId}\`;
        if (status) url += \`&status=\${status}\`;
        
        console.log('Loading members with URL:', url);
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          members = result.members;
          totalPages = result.pagination.pages;
          renderMembersTable();
          updatePagination();
          updateTotalMembers(result.pagination.total);
        }
      } catch (error) {
        console.error('Error loading members:', error);
        showAlert('Erreur lors du chargement des membres', 'danger');
      }
    }

    function renderMembersTable() {
      const tbody = document.getElementById('membersTableBody');
      tbody.innerHTML = '';

      members.forEach(member => {
        const customFields = member.custom_fields ? member.custom_fields.split(',') : [];
        const formattedFields = customFields.slice(0, 3).map(field => {
          const [name, value] = field.split(':');
          return \`<span class="badge bg-info me-1" title="\${name}: \${value}">\${name}</span>\`;
        }).join('');
        
        // Formater les programmes
        const programs = member.programs ? member.programs.split(',') : [];
        const formattedPrograms = programs.slice(0, 2).map(program => 
          \`<span class="badge bg-primary me-1">\${program.trim()}</span>\`
        ).join('');
        
        // Formater les classes
        const classes = member.classes ? member.classes.split(',') : [];
        const formattedClasses = classes.slice(0, 2).map(classItem => 
          \`<span class="badge bg-info me-1">\${classItem.trim()}</span>\`
        ).join('');
        
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>
            <div class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center text-white">
              <i class="bi bi-person-fill"></i>
            </div>
          </td>
          <td>
            <div class="fw-bold">\${member.first_name} \${member.last_name}</div>
            <small class="text-muted">ID: \${member.id}</small>
          </td>
          <td>
            <a href="mailto:\${member.email}" class="text-decoration-none">\${member.email}</a>
          </td>
          <td>\${member.phone || '-'}</td>
          <td>\${member.school_name || 'Non assigné'}</td>
          <td>
            \${formattedPrograms}
            \${programs.length > 2 ? \`<span class="badge bg-secondary">+\${programs.length - 2}</span>\` : ''}
            \${programs.length === 0 ? '<span class="text-muted">Aucun programme</span>' : ''}
          </td>
          <td>
            \${formattedClasses}
            \${classes.length > 2 ? \`<span class="badge bg-secondary">+\${classes.length - 2}</span>\` : ''}
            \${classes.length === 0 ? '<span class="text-muted">Aucune classe</span>' : ''}
          </td>
          <td>
            <span class="badge bg-info">\${member.school_role || 'student'}</span>
          </td>
          <td>
            \${getMemberStatusBadge(member.is_active)}
          </td>
          <td>
            \${formattedFields}
            \${customFields.length > 3 ? \`<span class="badge bg-secondary">+\${customFields.length - 3}</span>\` : ''}
          </td>
          <td>\${new Date(member.created_at).toLocaleDateString('fr-FR')}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <a href="/members/view/\${member.id}" class="btn btn-outline-success" title="Voir détails">
                <i class="bi bi-eye"></i>
              </a>
              <a href="/members/edit/\${member.id}" class="btn btn-outline-primary" title="Modifier">
                <i class="bi bi-pencil"></i>
              </a>
              <button class="btn btn-outline-danger" onclick="deleteMember(\${member.id})" title="Supprimer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function updatePagination() {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';

      // Previous button
      const prevLi = document.createElement('li');
      prevLi.className = \`page-item \${currentPage === 1 ? 'disabled' : ''}\`;
      prevLi.innerHTML = \`<a class="page-link" href="#" onclick="changePage(\${currentPage - 1})">Précédent</a>\`;
      pagination.appendChild(prevLi);

      // Page numbers
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = \`page-item \${i === currentPage ? 'active' : ''}\`;
        li.innerHTML = \`<a class="page-link" href="#" onclick="changePage(\${i})">\${i}</a>\`;
        pagination.appendChild(li);
      }

      // Next button
      const nextLi = document.createElement('li');
      nextLi.className = \`page-item \${currentPage === totalPages ? 'disabled' : ''}\`;
      nextLi.innerHTML = \`<a class="page-link" href="#" onclick="changePage(\${currentPage + 1})">Suivant</a>\`;
      pagination.appendChild(nextLi);
    }

    function updateTotalMembers(total) {
      document.getElementById('totalMembers').textContent = \`\${total} membres\`;
      const start = (currentPage - 1) * 50 + 1;
      const end = Math.min(currentPage * 50, total);
      document.getElementById('paginationInfo').textContent = \`Affichage de \${start} à \${end} sur \${total}\`;
    }

    function changePage(page) {
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        loadMembers();
      }
    }


    function deleteMember(memberId) {
      deleteMemberId = memberId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      if (!deleteMemberId) return;

      try {
        const response = await fetch(\`/api/members?id=\${deleteMemberId}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Membre supprimé avec succès', 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadMembers();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting member:', error);
        showAlert('Erreur lors de la suppression', 'danger');
      }
    }


    function filterMembers() {
      currentPage = 1;
      loadMembers();
    }

    function refreshMembers() {
      loadMembers();
      showAlert('Membres actualisés', 'info');
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

    function handleUrlParams() {
      // Cette fonction est maintenant gérée dans loadClasses()
      // pour s'assurer que les classes sont chargées avant d'appliquer le filtre
      console.log('handleUrlParams called - logic moved to loadClasses()');
    }

    function getMemberStatusBadge(isActive) {
      if (isActive === 1) {
        return '<span class="badge bg-success">Actif</span>';
      } else if (isActive === 0) {
        return '<span class="badge bg-secondary">Inactif</span>';
      } else if (isActive === 9) {
        return '<span class="badge bg-danger">Banni</span>';
      }
      return '<span class="badge bg-secondary">Inconnu</span>';
    }

    // Make functions globally accessible
    window.loadMembers = loadMembers;
    window.renderMembersTable = renderMembersTable;
    window.filterMembers = filterMembers;
    window.deleteMember = deleteMember;
    window.confirmDelete = confirmDelete;
    window.refreshMembers = refreshMembers;
    window.showAlert = showAlert;
    window.getMemberStatusBadge = getMemberStatusBadge;
  `;

  return getAdminLayout('Membres', content, '/members', user) + `<script>${scripts}</script>`;
}
