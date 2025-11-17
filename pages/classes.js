// ===== PAGE CLASSES - Admin MBA =====
// Page de gestion des classes

import { getAdminLayout } from '../templates/layout.js';

export function getClassesPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Classes Management</h1>
        <p class="text-muted mb-0">Gérer les classes et leurs représentants</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshClasses()">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
        <button class="btn btn-primary" onclick="showAddClassModal()">
          <i class="bi bi-plus-circle me-2"></i>Add Class
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Classes Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Classes List</h5>
          </div>
          <div class="col-auto">
            <div class="input-group" style="max-width: 300px;">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="searchClasses" placeholder="Search classes...">
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
                <th>Program</th>
                <th>Active Members</th>
                <th>Students</th>
                <th>Representative</th>
                <th>WhatsApp</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="classesTableBody">
              <!-- Classes will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Class Modal -->
    <div class="modal fade" id="classModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="classModalTitle">Add Class</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="classForm">
              <input type="hidden" id="classId">
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="classCode" class="form-label">Class Code</label>
                  <input type="text" class="form-control" id="classCode" required>
                </div>
                <div class="col-md-6">
                  <label for="classTitle" class="form-label">Class Title</label>
                  <input type="text" class="form-control" id="classTitle" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="classDescription" class="form-label">Description</label>
                <textarea class="form-control" id="classDescription" rows="3"></textarea>
              </div>
              
              <div class="mb-3">
                <label for="classWhatsAppLink" class="form-label">Lien Groupe WhatsApp</label>
                <input type="url" class="form-control" id="classWhatsAppLink" placeholder="https://chat.whatsapp.com/...">
                <small class="form-text text-muted">Lien d'invitation vers le groupe WhatsApp de la classe</small>
              </div>
              
              <div class="mb-3">
                <label for="classSchool" class="form-label">School</label>
                <select class="form-select" id="classSchool" required>
                  <option value="">Select School</option>
                  <!-- Schools will be loaded here -->
                </select>
              </div>

              <div class="mb-3">
                <label for="classRepresentative" class="form-label">Representative (Optional)</label>
                <select class="form-select" id="classRepresentative">
                  <option value="">Select Representative</option>
                  <!-- Members will be loaded here -->
                </select>
                <small class="form-text text-muted">Assign a representative to this class</small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="saveClass()">Save Class</button>
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
            <p>Are you sure you want to delete this class? This action cannot be undone.</p>
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
    let classes = [];
    let schools = [];
    let members = [];
    let deleteClassId = null;

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadSchools();
      loadMembers();
      loadClasses();
      setupEventListeners();
    });

    function setupEventListeners() {
      // Search functionality
      document.getElementById('searchClasses').addEventListener('input', function(e) {
        filterClasses(e.target.value);
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

    async function loadMembers() {
      try {
        const response = await fetch('/api/members');
        const result = await response.json();
        
        if (result.success) {
          members = result.members;
          populateMemberSelect();
        }
      } catch (error) {
        console.error('Error loading members:', error);
        showAlert('Error loading members', 'danger');
      }
    }

    function populateSchoolSelect() {
      const select = document.getElementById('classSchool');
      select.innerHTML = '<option value="">Select School</option>';
      
      schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        select.appendChild(option);
      });
    }

    function populateMemberSelect() {
      const select = document.getElementById('classRepresentative');
      select.innerHTML = '<option value="">Select Representative</option>';
      
      members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = \`\${member.first_name} \${member.last_name}\`;
        select.appendChild(option);
      });
    }

    async function loadClasses() {
      try {
        const response = await fetch('/api/classes');
        const result = await response.json();
        
        if (result.success) {
          classes = result.classes;
          // Debug: vérifier les données reçues
          if (classes.length > 0) {
            console.log('Sample class data:', {
              code: classes[0].code,
              student_count: classes[0].student_count,
              active_members_count: classes[0].active_members_count,
              program_title: classes[0].program_title
            });
          }
          renderClassesTable();
        }
      } catch (error) {
        console.error('Error loading classes:', error);
        showAlert('Error loading classes', 'danger');
      }
    }

    function renderClassesTable() {
      const tbody = document.getElementById('classesTableBody');
      tbody.innerHTML = '';

      classes.forEach(classItem => {
        const row = document.createElement('tr');
        
        // Format representative info
        let representativeInfo = '-';
        if (classItem.representative_id) {
          representativeInfo = \`\${classItem.rep_first_name} \${classItem.rep_last_name}\`;
          if (classItem.rep_status === 'active') {
            representativeInfo += ' <span class="badge bg-success">Active</span>';
          } else {
            representativeInfo += ' <span class="badge bg-secondary">Inactive</span>';
          }
        }
        
        // Format WhatsApp link
        let whatsappLink = '-';
        if (classItem.whatsapp_group_link) {
          whatsappLink = \`<a href="\${classItem.whatsapp_group_link}" target="_blank" class="btn btn-sm btn-success" title="Ouvrir le groupe WhatsApp">
            <i class="bi bi-whatsapp"></i> Groupe
          </a>\`;
        }
        
        // Format program (utilise le program_id de la classe)
        let programDisplay = '-';
        if (classItem.program_title) {
          programDisplay = \`<span class="badge bg-secondary">\${classItem.program_title}</span>\`;
        }
        
        // Format active members count - utiliser directement la valeur de l'API
        const activeCount = classItem.active_members_count !== null && classItem.active_members_count !== undefined ? classItem.active_members_count : 0;
        
        row.innerHTML = \`
          <td><span class="badge bg-primary">\${classItem.code}</span></td>
          <td>\${classItem.title}</td>
          <td>\${classItem.school_name || 'Unknown'}</td>
          <td>\${programDisplay}</td>
          <td>
            <span class="badge bg-success">\${activeCount}</span>
          </td>
          <td>
            <span class="badge bg-info">\${classItem.student_count || 0}</span>
          </td>
          <td>\${representativeInfo}</td>
          <td>\${whatsappLink}</td>
          <td>\${classItem.description ? classItem.description.substring(0, 50) + '...' : '-'}</td>
          <td>\${new Date(classItem.created_at).toLocaleDateString()}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editClass(\${classItem.id})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-info" onclick="manageRepresentative(\${classItem.id})" title="Manage Representative">
                <i class="bi bi-person-gear"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteClass(\${classItem.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function filterClasses(searchTerm) {
      const filtered = classes.filter(classItem => 
        classItem.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (classItem.program_title && classItem.program_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (classItem.rep_first_name && classItem.rep_first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (classItem.rep_last_name && classItem.rep_last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Re-render table with filtered results
      const tbody = document.getElementById('classesTableBody');
      tbody.innerHTML = '';

      filtered.forEach(classItem => {
        const row = document.createElement('tr');
        
        // Format representative info
        let representativeInfo = '-';
        if (classItem.representative_id) {
          representativeInfo = \`\${classItem.rep_first_name} \${classItem.rep_last_name}\`;
          if (classItem.rep_status === 'active') {
            representativeInfo += ' <span class="badge bg-success">Active</span>';
          } else {
            representativeInfo += ' <span class="badge bg-secondary">Inactive</span>';
          }
        }
        
        // Format WhatsApp link
        let whatsappLink = '-';
        if (classItem.whatsapp_group_link) {
          whatsappLink = \`<a href="\${classItem.whatsapp_group_link}" target="_blank" class="btn btn-sm btn-success" title="Ouvrir le groupe WhatsApp">
            <i class="bi bi-whatsapp"></i> Groupe
          </a>\`;
        }
        
        // Format program (utilise le program_id de la classe)
        let programDisplay = '-';
        if (classItem.program_title) {
          programDisplay = \`<span class="badge bg-secondary">\${classItem.program_title}</span>\`;
        }
        
        // Format active members count - utiliser directement la valeur de l'API
        const activeCount = classItem.active_members_count !== null && classItem.active_members_count !== undefined ? classItem.active_members_count : 0;
        
        row.innerHTML = \`
          <td><span class="badge bg-primary">\${classItem.code}</span></td>
          <td>\${classItem.title}</td>
          <td>\${classItem.school_name || 'Unknown'}</td>
          <td>\${programDisplay}</td>
          <td>
            <span class="badge bg-success">\${activeCount}</span>
          </td>
          <td>
            <span class="badge bg-info">\${classItem.student_count || 0}</span>
          </td>
          <td>\${representativeInfo}</td>
          <td>\${whatsappLink}</td>
          <td>\${classItem.description ? classItem.description.substring(0, 50) + '...' : '-'}</td>
          <td>\${new Date(classItem.created_at).toLocaleDateString()}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="editClass(\${classItem.id})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-info" onclick="manageRepresentative(\${classItem.id})" title="Manage Representative">
                <i class="bi bi-person-gear"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="deleteClass(\${classItem.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function showAddClassModal() {
      document.getElementById('classModalTitle').textContent = 'Add Class';
      document.getElementById('classForm').reset();
      document.getElementById('classId').value = '';
      
      const modal = new bootstrap.Modal(document.getElementById('classModal'));
      modal.show();
    }

    function editClass(classId) {
      const classItem = classes.find(c => c.id === classId);
      if (!classItem) return;

      document.getElementById('classModalTitle').textContent = 'Edit Class';
      document.getElementById('classId').value = classItem.id;
      document.getElementById('classCode').value = classItem.code;
      document.getElementById('classTitle').value = classItem.title;
      document.getElementById('classDescription').value = classItem.description || '';
      document.getElementById('classWhatsAppLink').value = classItem.whatsapp_group_link || '';
      document.getElementById('classSchool').value = classItem.school_id;
      document.getElementById('classRepresentative').value = classItem.representative_id || '';
      
      const modal = new bootstrap.Modal(document.getElementById('classModal'));
      modal.show();
    }

    async function saveClass() {
      const formData = {
        id: document.getElementById('classId').value,
        code: document.getElementById('classCode').value,
        title: document.getElementById('classTitle').value,
        description: document.getElementById('classDescription').value,
        whatsapp_group_link: document.getElementById('classWhatsAppLink').value,
        school_id: document.getElementById('classSchool').value,
        representative_id: document.getElementById('classRepresentative').value
      };

      if (!formData.code || !formData.title || !formData.school_id) {
        showAlert('Please fill in all required fields', 'danger');
        return;
      }

      try {
        const url = formData.id ? \`/api/classes/\${formData.id}\` : '/api/classes';
        const method = formData.id ? 'PUT' : 'POST';
        
        // Remove representative_id from class data
        const { representative_id, ...classData } = formData;
        
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classData)
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'success');
          bootstrap.Modal.getInstance(document.getElementById('classModal')).hide();
          
          // If representative is assigned, handle it separately
          if (representative_id && representative_id !== '') {
            await assignRepresentative(formData.id || result.class_id, representative_id);
          }
          
          loadClasses();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving class:', error);
        showAlert('Error saving class', 'danger');
      }
    }

    async function assignRepresentative(classId, memberId) {
      try {
        const response = await fetch('/api/class-representatives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            class_id: classId,
            member_id: memberId,
            role: 'representative'
          })
        });

        const result = await response.json();
        if (!result.success) {
          console.error('Error assigning representative:', result.error);
        }
      } catch (error) {
        console.error('Error assigning representative:', error);
      }
    }

    function manageRepresentative(classId) {
      // Redirect to members page with class filter
      window.location.href = \`/members?class_id=\${classId}\`;
    }

    function deleteClass(classId) {
      deleteClassId = classId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      if (!deleteClassId) return;

      try {
        const response = await fetch(\`/api/classes/\${deleteClassId}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Class deleted successfully', 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadClasses();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        showAlert('Error deleting class', 'danger');
      }
    }

    function refreshClasses() {
      loadClasses();
      showAlert('Classes refreshed', 'info');
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
    window.refreshClasses = refreshClasses;
    window.showAddClassModal = showAddClassModal;
    window.editClass = editClass;
    window.saveClass = saveClass;
    window.manageRepresentative = manageRepresentative;
    window.deleteClass = deleteClass;
    window.confirmDelete = confirmDelete;
    window.filterClasses = filterClasses;
  `;

  return getAdminLayout('Classes', content, '/classes', user) + `<script>${scripts}</script>`;
}
