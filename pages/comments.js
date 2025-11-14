// ===== PAGE COMMENTS - Admin MBA =====
// Page de gestion des commentaires

import { getAdminLayout } from '../templates/layout.js';

export function getCommentsPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Gestion des Commentaires</h1>
        <p class="text-muted mb-0">Consulter et gérer les commentaires</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshComments()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <h6 class="card-title mb-1">Total Commentaires</h6>
                <h3 class="mb-0" id="statTotal">0</h3>
              </div>
              <div class="flex-shrink-0">
                <i class="bi bi-chat-dots fs-1 opacity-75"></i>
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
                <h6 class="card-title mb-1">Approuvés</h6>
                <h3 class="mb-0" id="statApproved">0</h3>
              </div>
              <div class="flex-shrink-0">
                <i class="bi bi-check-circle fs-1 opacity-75"></i>
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
                <h6 class="card-title mb-1">En Attente</h6>
                <h3 class="mb-0" id="statPending">0</h3>
              </div>
              <div class="flex-shrink-0">
                <i class="bi bi-clock-history fs-1 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <h6 class="card-title mb-1">Rejetés</h6>
                <h3 class="mb-0" id="statRejected">0</h3>
              </div>
              <div class="flex-shrink-0">
                <i class="bi bi-x-circle fs-1 opacity-75"></i>
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
            <label for="filterStatus" class="form-label">Statut</label>
            <select class="form-select" id="filterStatus">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="approved">Approuvé</option>
              <option value="pending">En attente</option>
              <option value="rejected">Rejeté</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="filterEntityType" class="form-label">Type de contenu</label>
            <select class="form-select" id="filterEntityType">
              <option value="">Tous les types</option>
              <option value="video">Vidéo</option>
              <option value="course">Cours</option>
              <option value="module">Module</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="filterSearch" class="form-label">Rechercher</label>
            <input type="text" class="form-control" id="filterSearch" placeholder="Rechercher par contenu, auteur...">
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Table -->
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">Liste des Commentaires</h5>
          <span class="badge bg-primary" id="totalCount">0 commentaires</span>
        </div>
        
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Auteur</th>
                <th>Type</th>
                <th>Contenu ID</th>
                <th>Parent ID</th>
                <th>Commentaire</th>
                <th>Likes</th>
                <th>Réponses</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="commentsTableBody">
              <tr>
                <td colspan="11" class="text-center py-4">
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
            <h5 class="modal-title">Modifier le Statut</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="statusForm">
              <input type="hidden" id="commentId" value="">
              <div class="mb-3">
                <label for="newStatus" class="form-label">Nouveau Statut *</label>
                <select class="form-select" id="newStatus" required>
                  <option value="">Sélectionner un statut</option>
                  <option value="active">Actif</option>
                  <option value="approved">Approuvé</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Rejeté</option>
                  <option value="inactive">Inactif</option>
                </select>
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
    let comments = [];
    let filteredComments = [];

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadComments();
      setupEventListeners();
    });

    function setupEventListeners() {
      const filterStatus = document.getElementById('filterStatus');
      if (filterStatus) filterStatus.addEventListener('change', filterComments);
      
      const filterEntityType = document.getElementById('filterEntityType');
      if (filterEntityType) filterEntityType.addEventListener('change', filterComments);
      
      const filterSearch = document.getElementById('filterSearch');
      if (filterSearch) filterSearch.addEventListener('keyup', filterComments);
    }

    async function loadComments() {
      try {
        const tbody = document.getElementById('commentsTableBody');
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="11" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></td></tr>';
        }
        
        const response = await fetch('/api/comments');
        const result = await response.json();
        
        if (result.success) {
          comments = result.comments || [];
          filteredComments = [...comments];
          renderCommentsTable();
          updateStats();
          updateTotalCount();
        } else {
          showAlert('Erreur lors du chargement des commentaires: ' + (result.error || 'Erreur inconnue'), 'danger');
          if (tbody) {
            tbody.innerHTML = '<tr><td colspan="11" class="text-center py-4 text-danger">Erreur lors du chargement</td></tr>';
          }
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        showAlert('Erreur: ' + error.message, 'danger');
        const tbody = document.getElementById('commentsTableBody');
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="11" class="text-center py-4 text-danger">Erreur: ' + error.message + '</td></tr>';
        }
      }
    }

    function renderCommentsTable() {
      const tbody = document.getElementById('commentsTableBody');
      if (!tbody) return;
      
        if (filteredComments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center py-4 text-muted">Aucun commentaire trouvé</td></tr>';
        return;
      }
      
      let html = '';
      filteredComments.forEach(function(comment) {
        const statusBadge = getStatusBadge(comment.status);
        const entityTypeBadge = getEntityTypeBadge(comment.content_type);
        const contentPreview = comment.comment_text ? (comment.comment_text.length > 100 ? comment.comment_text.substring(0, 100) + '...' : comment.comment_text) : '-';
        const date = comment.created_at ? new Date(comment.created_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }) : '-';
        
        html += '<tr>';
        html += '<td>' + comment.id + '</td>';
        html += '<td>';
        html += '<div class="fw-bold">' + escapeHtml(comment.author_name || comment.author_email || 'Anonyme') + '</div>';
        html += '<small class="text-muted">' + escapeHtml(comment.author_email || '') + '</small>';
        html += '</td>';
        html += '<td>' + entityTypeBadge + '</td>';
        html += '<td>' + (comment.content_id || '-') + '</td>';
        html += '<td>' + (comment.parent_id ? '<span class="badge bg-info">Réponse à #' + comment.parent_id + '</span>' : '<span class="text-muted">-</span>') + '</td>';
        html += '<td><div class="text-truncate" style="max-width: 300px;" title="' + escapeHtml(contentPreview) + '">' + escapeHtml(contentPreview) + '</div></td>';
        html += '<td><span class="badge bg-secondary">' + (comment.likes_count || 0) + '</span></td>';
        html += '<td><span class="badge bg-info">' + (comment.replies_count || 0) + '</span></td>';
        html += '<td>' + statusBadge + '</td>';
        html += '<td><small class="text-muted">' + date + '</small></td>';
        html += '<td>';
        html += '<div class="btn-group btn-group-sm">';
        html += '<button type="button" class="btn btn-outline-primary" onclick="editStatus(' + comment.id + ')" title="Modifier le statut">';
        html += '<i class="bi bi-pencil"></i>';
        html += '</button>';
        html += '<button type="button" class="btn btn-outline-danger" onclick="deleteComment(' + comment.id + ')" title="Supprimer">';
        html += '<i class="bi bi-trash"></i>';
        html += '</button>';
        html += '</div>';
        html += '</td>';
        html += '</tr>';
      });
      
      tbody.innerHTML = html;
    }

    function getStatusBadge(status) {
      const badges = {
        'active': '<span class="badge bg-success">Actif</span>',
        'approved': '<span class="badge bg-success">Approuvé</span>',
        'pending': '<span class="badge bg-warning">En attente</span>',
        'rejected': '<span class="badge bg-danger">Rejeté</span>',
        'inactive': '<span class="badge bg-secondary">Inactif</span>'
      };
      return badges[status] || '<span class="badge bg-secondary">' + escapeHtml(status || 'N/A') + '</span>';
    }

    function getEntityTypeBadge(entityType) {
      const badges = {
        'video': '<span class="badge bg-info">Vidéo</span>',
        'course': '<span class="badge bg-primary">Cours</span>',
        'module': '<span class="badge bg-secondary">Module</span>'
      };
      return badges[entityType] || '<span class="badge bg-secondary">' + escapeHtml(entityType || 'N/A') + '</span>';
    }

    function filterComments() {
      const status = document.getElementById('filterStatus').value;
      const entityType = document.getElementById('filterEntityType').value;
      const search = document.getElementById('filterSearch').value.toLowerCase();
      
      filteredComments = comments.filter(function(comment) {
        const statusMatch = !status || comment.status === status;
        const entityTypeMatch = !entityType || comment.content_type === entityType;
        const searchMatch = !search || 
          (comment.comment_text && comment.comment_text.toLowerCase().includes(search)) ||
          (comment.author_name && comment.author_name.toLowerCase().includes(search)) ||
          (comment.author_email && comment.author_email.toLowerCase().includes(search));
        
        return statusMatch && entityTypeMatch && searchMatch;
      });
      
      renderCommentsTable();
      updateTotalCount();
    }

    function updateStats() {
      const total = comments.length;
      const approved = comments.filter(function(c) { return c.status === 'approved' || c.status === 'active'; }).length;
      const pending = comments.filter(function(c) { return c.status === 'pending'; }).length;
      const rejected = comments.filter(function(c) { return c.status === 'rejected'; }).length;
      
      document.getElementById('statTotal').textContent = total;
      document.getElementById('statApproved').textContent = approved;
      document.getElementById('statPending').textContent = pending;
      document.getElementById('statRejected').textContent = rejected;
    }

    function updateTotalCount() {
      const totalEl = document.getElementById('totalCount');
      if (totalEl) {
        totalEl.textContent = filteredComments.length + ' commentaire' + (filteredComments.length > 1 ? 's' : '');
      }
    }

    function editStatus(commentId) {
      const comment = comments.find(function(c) { return c.id === commentId; });
      if (!comment) return;
      
      document.getElementById('commentId').value = commentId;
      document.getElementById('newStatus').value = comment.status || 'pending';
      
      const modal = new bootstrap.Modal(document.getElementById('statusModal'));
      modal.show();
    }

    async function saveStatus() {
      const commentId = document.getElementById('commentId').value;
      const newStatus = document.getElementById('newStatus').value;
      
      if (!commentId || !newStatus) {
        showAlert('Veuillez sélectionner un statut', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/comments/' + commentId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('Statut mis à jour avec succès', 'success');
          bootstrap.Modal.getInstance(document.getElementById('statusModal')).hide();
          loadComments();
        } else {
          showAlert('Erreur: ' + (result.error || 'Erreur lors de la mise à jour'), 'danger');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        showAlert('Erreur: ' + error.message, 'danger');
      }
    }

    async function deleteComment(commentId) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
        return;
      }
      
      try {
        const response = await fetch('/api/comments/' + commentId, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('Commentaire supprimé avec succès', 'success');
          loadComments();
        } else {
          showAlert('Erreur: ' + (result.error || 'Erreur lors de la suppression'), 'danger');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        showAlert('Erreur: ' + error.message, 'danger');
      }
    }

    function refreshComments() {
      loadComments();
      showAlert('Commentaires actualisés', 'info');
    }

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

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Make functions globally accessible
    window.refreshComments = refreshComments;
    window.editStatus = editStatus;
    window.saveStatus = saveStatus;
    window.deleteComment = deleteComment;
  `;

  return getAdminLayout('Commentaires', content, '/comments', user) + `<script>${scripts}</script>`;
}

