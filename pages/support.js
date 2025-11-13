// ===== PAGE SUPPORT - W-AffBooster =====
// Page de support avec Bootstrap 5

import { getAdminLayout } from '../templates/layout.js';

export function getSupportPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Support Center</h1>
        <p class="text-muted mb-0">Get help and support for your affiliate marketing needs</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshTickets()">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
        <button class="btn btn-primary" onclick="openNewTicket()">
          <i class="bi bi-plus-circle me-2"></i>New Ticket
        </button>
      </div>
    </div>

    <!-- Support Options -->
    <div class="row g-4 mb-4">
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center p-4">
            <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-book text-primary fs-4"></i>
            </div>
            <h5 class="fw-bold mb-3">Documentation</h5>
            <p class="text-muted mb-3">Learn how to use the platform effectively</p>
            <a href="#" class="btn btn-outline-primary">View Docs</a>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center p-4">
            <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-question-circle text-info fs-4"></i>
            </div>
            <h5 class="fw-bold mb-3">FAQ</h5>
            <p class="text-muted mb-3">Find answers to common questions</p>
            <a href="#" class="btn btn-outline-info">View FAQ</a>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center p-4">
            <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-chat-dots text-success fs-4"></i>
            </div>
            <h5 class="fw-bold mb-3">Live Chat</h5>
            <p class="text-muted mb-3">Get instant help from our support team</p>
            <a href="#" class="btn btn-outline-success">Start Chat</a>
          </div>
        </div>
      </div>
      
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center p-4">
            <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-mortarboard text-warning fs-4"></i>
            </div>
            <h5 class="fw-bold mb-3">Tutorials</h5>
            <p class="text-muted mb-3">Step-by-step guides and tutorials</p>
            <a href="#" class="btn btn-outline-warning">View Tutorials</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Ticket Form -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-ticket-perforated me-2"></i>Submit a Support Ticket
            </h5>
          </div>
          <div class="card-body">
            <form onsubmit="submitTicket(event)">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="subject" class="form-label">Subject</label>
                  <input type="text" id="subject" class="form-control" placeholder="Brief description of your issue" required>
                </div>
                <div class="col-md-3">
                  <label for="category" class="form-label">Category</label>
                  <select id="category" class="form-select" required>
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="offer">Offer Related</option>
                    <option value="account">Account Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="priority" class="form-label">Priority</label>
                  <select id="priority" class="form-select" required>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="description" class="form-label">Description</label>
                  <textarea id="description" class="form-control" rows="4" placeholder="Please provide detailed information about your issue..." required></textarea>
                </div>
                <div class="col-12">
                  <label for="attachments" class="form-label">Attachments (Optional)</label>
                  <input type="file" id="attachments" class="form-control" multiple accept="image/*,.pdf,.doc,.docx">
                  <div class="form-text">You can attach screenshots or documents to help us understand your issue better.</div>
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-send me-2"></i>Submit Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- My Support Tickets -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-ticket-perforated me-2"></i>My Support Tickets
            </h5>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" id="statusFilter" onchange="filterTickets()">
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div id="ticketsContainer">
              <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading tickets...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    async function loadTickets() {
      try {
        const response = await fetch('/api/support/tickets');
        if (response.ok) {
          const data = await response.json();
          displayTickets(data.tickets || []);
        } else {
          showError('Failed to load tickets');
        }
      } catch (error) {
        console.error('Error loading tickets:', error);
        showError('Error loading tickets');
      }
    }
    
    function displayTickets(tickets) {
      const container = document.getElementById('ticketsContainer');
      
      if (tickets.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="bi bi-ticket-perforated fs-1 text-muted"></i>
            </div>
            <h4 class="text-muted">No support tickets</h4>
            <p class="text-muted">You haven't submitted any support tickets yet.</p>
            <button onclick="openNewTicket()" class="btn btn-primary">Create First Ticket</button>
          </div>
        \`;
        return;
      }
      
      container.innerHTML = \`
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${tickets.map(ticket => \`
                <tr>
                  <td>
                    <code class="text-primary">#\${ticket.id}</code>
                  </td>
                  <td>
                    <div class="fw-bold">\${ticket.subject}</div>
                    <small class="text-muted">\${ticket.description.substring(0, 50)}...</small>
                  </td>
                  <td>
                    <span class="badge bg-secondary">\${ticket.category}</span>
                  </td>
                  <td>
                    <span class="badge \${getPriorityBadgeClass(ticket.priority)}">\${ticket.priority}</span>
                  </td>
                  <td>
                    <span class="badge \${getStatusBadgeClass(ticket.status)}">\${ticket.status}</span>
                  </td>
                  <td>
                    <div class="fw-bold">\${new Date(ticket.created_at).toLocaleDateString()}</div>
                    <small class="text-muted">\${new Date(ticket.created_at).toLocaleTimeString()}</small>
                  </td>
                  <td>
                    <button onclick="viewTicket('\${ticket.id}')" class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-eye me-1"></i>View
                    </button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \`;
    }
    
    function getPriorityBadgeClass(priority) {
      switch (priority) {
        case 'urgent': return 'bg-danger';
        case 'high': return 'bg-warning';
        case 'medium': return 'bg-info';
        case 'low': return 'bg-secondary';
        default: return 'bg-secondary';
      }
    }
    
    function getStatusBadgeClass(status) {
      switch (status) {
        case 'open': return 'bg-success';
        case 'in_progress': return 'bg-warning';
        case 'resolved': return 'bg-info';
        case 'closed': return 'bg-secondary';
        default: return 'bg-secondary';
      }
    }
    
    async function submitTicket(e) {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('subject', document.getElementById('subject').value);
      formData.append('category', document.getElementById('category').value);
      formData.append('priority', document.getElementById('priority').value);
      formData.append('description', document.getElementById('description').value);
      
      const attachments = document.getElementById('attachments').files;
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
      
      try {
        const response = await fetch('/api/support/tickets', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          showToast('Support ticket submitted successfully! Ticket ID: #' + data.ticket_id, 'success');
          
          // Reset form
          document.getElementById('subject').value = '';
          document.getElementById('category').value = '';
          document.getElementById('priority').value = 'medium';
          document.getElementById('description').value = '';
          document.getElementById('attachments').value = '';
          
          loadTickets();
        } else {
          const error = await response.json();
          showToast('Error submitting ticket: ' + error.error, 'error');
        }
      } catch (error) {
        console.error('Error submitting ticket:', error);
        showToast('Error submitting ticket. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
    
    function viewTicket(ticketId) {
      showToast('Ticket details for ID: #' + ticketId, 'info');
    }
    
    function openNewTicket() {
      document.getElementById('subject').focus();
      document.getElementById('subject').scrollIntoView({ behavior: 'smooth' });
    }
    
    function refreshTickets() {
      loadTickets();
      showToast('Tickets refreshed', 'info');
    }
    
    function filterTickets() {
      const status = document.getElementById('statusFilter').value;
      // Implementation for filtering tickets by status
      loadTickets();
    }
    
    function showError(message) {
      document.getElementById('ticketsContainer').innerHTML = \`
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          \${message}
          <button onclick="loadTickets()" class="btn btn-sm btn-outline-danger ms-2">Try Again</button>
        </div>
      \`;
    }
    
    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = \`alert alert-\${type === 'error' ? 'danger' : type} position-fixed\`;
      toast.style.top = '20px';
      toast.style.right = '20px';
      toast.style.zIndex = '9999';
      toast.innerHTML = \`
        <i class="bi bi-\${type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
        \${message}
      \`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 5000);
    }
    
    // Load tickets on page load
    document.addEventListener('DOMContentLoaded', loadTickets);
  `;

  return getAdminLayout('Support', content, '/support', user) + `<script>${scripts}</script>`;
}