// ===== PAGE PROGRAMS - Admin MBA =====
// Page de gestion des programmes de formation

import { getAdminLayout } from '../templates/layout.js';

export function getProgramsPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Programs Management</h1>
        <p class="text-muted mb-0">Gérer les programmes de formation</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshPrograms()">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
        <button class="btn btn-primary" onclick="showAddProgramModal()">
          <i class="bi bi-plus-circle me-2"></i>Add Program
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Programs Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Programs List</h5>
          </div>
          <div class="col-auto">
            <div class="input-group" style="max-width: 300px;">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="searchPrograms" placeholder="Search programs...">
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>School</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="programsTableBody">
              <!-- Programs will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Program Modal -->
    <div class="modal fade" id="programModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="programModalTitle">Add Program</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="programForm">
              <input type="hidden" id="programId">
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="programCode" class="form-label">Program Code</label>
                  <input type="text" class="form-control" id="programCode" required>
                </div>
                <div class="col-md-6">
                  <label for="programTitle" class="form-label">Program Title</label>
                  <input type="text" class="form-control" id="programTitle" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="programDescription" class="form-label">Description</label>
                <textarea class="form-control" id="programDescription" rows="3"></textarea>
              </div>
              
              <div class="mb-3">
                <label for="programSchool" class="form-label">School</label>
                <select class="form-select" id="programSchool" required>
                  <option value="">Select School</option>
                  <!-- Schools will be loaded here -->
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="saveProgram()">Save Program</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this program? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let programs = [];
    let schools = [];
    let deleteProgramId = null;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadSchools();
      loadPrograms();
      setupEventListeners();
    });

    function setupEventListeners() {
      // Search functionality
      document.getElementById('searchPrograms').addEventListener('input', function(e) {
        filterPrograms(e.target.value);
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
        showAlert('Error loading schools', 'danger');
      }
    }

    function populateSchoolSelect() {
      const select = document.getElementById('programSchool');
      select.innerHTML = '<option value="">Select School</option>';
      
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
          renderProgramsTable();
        }
      } catch (error) {
        console.error('Error loading programs:', error);
        showAlert('Error loading programs', 'danger');
      }
    }

    function renderProgramsTable() {
      const tbody = document.getElementById('programsTableBody');
      tbody.innerHTML = '';

      programs.forEach(program => {
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td><span class="badge bg-primary">\${program.code}</span></td>
          <td>\${program.title}</td>
          <td>\${program.school_name || 'Unknown'}</td>
          <td>\${program.description ? program.description.substring(0, 50) + '...' : '-'}</td>
          <td>\${new Date(program.created_at).toLocaleDateString()}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editProgram(\${program.id})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteProgram(\${program.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function filterPrograms(searchTerm) {
      const filtered = programs.filter(program => 
        program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Re-render table with filtered results
      const tbody = document.getElementById('programsTableBody');
      tbody.innerHTML = '';

      filtered.forEach(program => {
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td><span class="badge bg-primary">\${program.code}</span></td>
          <td>\${program.title}</td>
          <td>\${program.school_name || 'Unknown'}</td>
          <td>\${program.description ? program.description.substring(0, 50) + '...' : '-'}</td>
          <td>\${new Date(program.created_at).toLocaleDateString()}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editProgram(\${program.id})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteProgram(\${program.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function showAddProgramModal() {
      document.getElementById('programModalTitle').textContent = 'Add Program';
      document.getElementById('programForm').reset();
      document.getElementById('programId').value = '';
      
      const modal = new bootstrap.Modal(document.getElementById('programModal'));
      modal.show();
    }

    function editProgram(programId) {
      const program = programs.find(p => p.id === programId);
      if (!program) return;

      document.getElementById('programModalTitle').textContent = 'Edit Program';
      document.getElementById('programId').value = program.id;
      document.getElementById('programCode').value = program.code;
      document.getElementById('programTitle').value = program.title;
      document.getElementById('programDescription').value = program.description || '';
      document.getElementById('programSchool').value = program.school_id;
      
      const modal = new bootstrap.Modal(document.getElementById('programModal'));
      modal.show();
    }

    async function saveProgram() {
      const formData = {
        id: document.getElementById('programId').value,
        code: document.getElementById('programCode').value,
        title: document.getElementById('programTitle').value,
        description: document.getElementById('programDescription').value,
        school_id: document.getElementById('programSchool').value
      };

      if (!formData.code || !formData.title || !formData.school_id) {
        showAlert('Please fill in all required fields', 'danger');
        return;
      }

      try {
        const url = formData.id ? \`/api/programs/\${formData.id}\` : '/api/programs';
        const method = formData.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('programModal')).hide();
          loadPrograms();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving program:', error);
        showAlert('Error saving program', 'danger');
      }
    }

    function deleteProgram(programId) {
      deleteProgramId = programId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      if (!deleteProgramId) return;

      try {
        const response = await fetch(\`/api/programs/\${deleteProgramId}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Program deleted successfully', 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadPrograms();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting program:', error);
        showAlert('Error deleting program', 'danger');
      }
    }

    function refreshPrograms() {
      loadPrograms();
      showAlert('Programs refreshed', 'info');
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
  `;

  return getAdminLayout('Programs', content, '/programs', user) + `<script>${scripts}</script>`;
}
