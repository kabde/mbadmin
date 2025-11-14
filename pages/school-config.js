// ===== PAGE SCHOOL CONFIG - Admin MBA =====
// Page de gestion de la configuration des écoles

import { getAdminLayout } from '../templates/layout.js';

export function getSchoolConfigPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Configuration des Écoles</h1>
        <p class="text-muted mb-0">Gérer la configuration SMTP, Discord, Skool, Facebook Pixel et Google Analytics pour chaque école</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshConfigs()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Configurations List -->
    <div id="configsContainer">
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3 text-muted">Chargement des configurations...</p>
      </div>
    </div>
  `;

  const scripts = `
    let configs = [];
    let schools = [];

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

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadSchools();
      loadConfigs();
    });

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
        }
      } catch (error) {
        console.error('Error loading schools:', error);
      }
    }

    async function loadConfigs() {
      try {
        const container = document.getElementById('configsContainer');
        container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></div>';
        
        const response = await fetch('/api/school-config');
        const result = await response.json();
        
        if (result.success) {
          configs = result.configs || [];
          renderConfigs();
        } else {
          showAlert('Erreur lors du chargement des configurations: ' + (result.error || 'Erreur inconnue'), 'danger');
          container.innerHTML = '<div class="alert alert-danger">Erreur lors du chargement</div>';
        }
      } catch (error) {
        console.error('Error loading configs:', error);
        showAlert('Erreur: ' + error.message, 'danger');
        const container = document.getElementById('configsContainer');
        if (container) {
          container.innerHTML = '<div class="alert alert-danger">Erreur: ' + error.message + '</div>';
        }
      }
    }

    function renderConfigs() {
      const container = document.getElementById('configsContainer');
      if (!container) return;
      
      if (configs.length === 0) {
        container.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>Aucune configuration trouvée</div>';
        return;
      }
      
      let html = '<div class="row g-4">';
      
      configs.forEach(config => {
        html += '<div class="col-lg-6">';
        html += '<div class="card h-100 shadow-sm border-0">';
        
        // Card Header avec gradient
        html += '<div class="card-header text-white border-0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">';
        html += '<div class="d-flex align-items-center justify-content-between">';
        html += '<div class="d-flex align-items-center">';
        html += '<div class="bg-white bg-opacity-20 rounded-circle p-2 me-3">';
        html += '<i class="bi bi-building fs-5"></i>';
        html += '</div>';
        html += '<div>';
        html += '<h5 class="mb-0 fw-bold">' + escapeHtml(config.school_name || 'École #' + config.school_id) + '</h5>';
        html += '<small class="opacity-75">Configuration de l&apos;école</small>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        // Card Body avec formulaire
        html += '<div class="card-body p-4">';
        html += '<form id="configForm' + config.id + '" onsubmit="saveConfig(event, ' + config.id + ')">';
        html += '<input type="hidden" name="configId" value="' + config.id + '">';
        
        // Section SMTP
        html += '<div class="mb-4">';
        html += '<div class="d-flex align-items-center mb-3">';
        html += '<div class="bg-primary bg-opacity-10 rounded-circle p-2 me-2">';
        html += '<i class="bi bi-envelope-at text-primary"></i>';
        html += '</div>';
        html += '<h6 class="mb-0 fw-bold">Configuration SMTP</h6>';
        html += '</div>';
        
        html += '<div class="mb-3">';
        html += '<label for="smtp_token_' + config.id + '" class="form-label fw-semibold">SMTP Token <span class="text-danger">*</span></label>';
        html += '<div class="input-group">';
        html += '<span class="input-group-text bg-light"><i class="bi bi-key"></i></span>';
        html += '<input type="text" class="form-control" id="smtp_token_' + config.id + '" name="smtp_token" value="' + escapeHtml(config.smtp_token || '') + '" placeholder="SG.xxxxxxxxxxxxx" required>';
        html += '</div>';
        html += '<small class="form-text text-muted"><i class="bi bi-info-circle me-1"></i>Token SendGrid pour l&apos;envoi d&apos;emails</small>';
        html += '</div>';
        
        html += '<div class="mb-3">';
        html += '<label for="smtp_email_from_' + config.id + '" class="form-label fw-semibold">Email From <span class="text-danger">*</span></label>';
        html += '<div class="input-group">';
        html += '<span class="input-group-text bg-light"><i class="bi bi-envelope"></i></span>';
        html += '<input type="email" class="form-control" id="smtp_email_from_' + config.id + '" name="smtp_email_from" value="' + escapeHtml(config.smtp_email_from || '') + '" placeholder="hello@mediabuying.ac" required>';
        html += '</div>';
        html += '<small class="form-text text-muted"><i class="bi bi-info-circle me-1"></i>Adresse email d&apos;expédition</small>';
        html += '</div>';
        html += '</div>';
        
        // Section Liens
        html += '<div class="mb-4">';
        html += '<div class="d-flex align-items-center mb-3">';
        html += '<div class="bg-info bg-opacity-10 rounded-circle p-2 me-2">';
        html += '<i class="bi bi-link-45deg text-info"></i>';
        html += '</div>';
        html += '<h6 class="mb-0 fw-bold">Liens de Communication</h6>';
        html += '</div>';
        
        html += '<div class="mb-3">';
        html += '<label for="discord_link_' + config.id + '" class="form-label fw-semibold">';
        html += '<i class="bi bi-discord text-primary me-2"></i>Lien Discord';
        html += '</label>';
        html += '<div class="input-group">';
        html += '<span class="input-group-text bg-light"><i class="bi bi-link-45deg"></i></span>';
        html += '<input type="url" class="form-control" id="discord_link_' + config.id + '" name="discord_link" value="' + escapeHtml(config.discord_link || '') + '" placeholder="https://discord.gg/xxxxx">';
        html += '</div>';
        html += '<small class="form-text text-muted"><i class="bi bi-info-circle me-1"></i>Lien d&apos;invitation Discord</small>';
        html += '</div>';
        
        html += '<div class="mb-3">';
        html += '<label for="skool_link_' + config.id + '" class="form-label fw-semibold">';
        html += '<i class="bi bi-globe text-success me-2"></i>Lien Skool';
        html += '</label>';
        html += '<div class="input-group">';
        html += '<span class="input-group-text bg-light"><i class="bi bi-link-45deg"></i></span>';
        html += '<input type="url" class="form-control" id="skool_link_' + config.id + '" name="skool_link" value="' + escapeHtml(config.skool_link || '') + '" placeholder="https://www.skool.com/...">';
        html += '</div>';
        html += '<small class="form-text text-muted"><i class="bi bi-info-circle me-1"></i>Lien vers la communauté Skool</small>';
        html += '</div>';
        html += '</div>';
        
        // Section Analytics & Tracking
        html += '<div class="mb-4">';
        html += '<div class="d-flex align-items-center mb-3">';
        html += '<div class="bg-warning bg-opacity-10 rounded-circle p-2 me-2">';
        html += '<i class="bi bi-graph-up text-warning"></i>';
        html += '</div>';
        html += '<h6 class="mb-0 fw-bold">Analytics & Tracking</h6>';
        html += '</div>';
        
        html += '<div class="mb-3">';
        html += '<label for="facebook_pixel_' + config.id + '" class="form-label fw-semibold">';
        html += '<i class="bi bi-facebook text-primary me-2"></i>Facebook Pixel ID';
        html += '</label>';
        html += '<div class="input-group">';
        html += '<span class="input-group-text bg-light"><i class="bi bi-hash"></i></span>';
        html += '<input type="text" class="form-control" id="facebook_pixel_' + config.id + '" name="facebook_pixel" value="' + escapeHtml(config.facebook_pixel || '') + '" placeholder="1070790841454040">';
        html += '</div>';
        html += '<small class="form-text text-muted"><i class="bi bi-info-circle me-1"></i>ID du Pixel Facebook pour le tracking</small>';
        html += '</div>';
        
        html += '<div class="mb-3">';
        html += '<label for="google_analytics_' + config.id + '" class="form-label fw-semibold">';
        html += '<i class="bi bi-google text-danger me-2"></i>Google Analytics ID';
        html += '</label>';
        html += '<div class="input-group">';
        html += '<span class="input-group-text bg-light"><i class="bi bi-hash"></i></span>';
        html += '<input type="text" class="form-control" id="google_analytics_' + config.id + '" name="google_analytics" value="' + escapeHtml(config.google_analytics || '') + '" placeholder="G-GER7RMV3NT">';
        html += '</div>';
        html += '<small class="form-text text-muted"><i class="bi bi-info-circle me-1"></i>ID Google Analytics (format: G-XXXXXXXXXX)</small>';
        html += '</div>';
        html += '</div>';
        
        // Bouton de sauvegarde
        html += '<div class="d-flex justify-content-between align-items-center pt-3 border-top">';
        html += '<div class="text-muted small">';
        html += '<i class="bi bi-calendar me-1"></i>Créé: ' + (config.created_at ? new Date(config.created_at).toLocaleDateString('fr-FR') : '-');
        html += ' <span class="mx-2">•</span> ';
        html += '<i class="bi bi-clock me-1"></i>Modifié: ' + (config.updated_at ? new Date(config.updated_at).toLocaleDateString('fr-FR') : '-');
        html += '</div>';
        html += '<button type="submit" class="btn btn-primary px-4">';
        html += '<i class="bi bi-check-lg me-2"></i>Enregistrer';
        html += '</button>';
        html += '</div>';
        
        html += '</form>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
      });
      
      html += '</div>';
      container.innerHTML = html;
    }

    async function saveConfig(event, configId) {
      event.preventDefault();
      
      const form = event.target;
      const formData = new FormData(form);
      
      const data = {
        smtp_token: formData.get('smtp_token') || null,
        smtp_email_from: formData.get('smtp_email_from') || null,
        discord_link: formData.get('discord_link') || null,
        skool_link: formData.get('skool_link') || null,
        facebook_pixel: formData.get('facebook_pixel') || null,
        google_analytics: formData.get('google_analytics') || null
      };
      
      try {
        const response = await fetch('/api/school-config/' + configId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('Configuration mise à jour avec succès', 'success');
          loadConfigs();
        } else {
          showAlert('Erreur: ' + (result.error || 'Erreur lors de la mise à jour'), 'danger');
        }
      } catch (error) {
        console.error('Error saving config:', error);
        showAlert('Erreur: ' + error.message, 'danger');
      }
    }

    function refreshConfigs() {
      loadConfigs();
      showAlert('Configurations actualisées', 'info');
    }

    // Make functions globally accessible
    window.saveConfig = saveConfig;
    window.refreshConfigs = refreshConfigs;
  `;

  return getAdminLayout('Configuration des Écoles', content, '/school-config', user) + `<script>${scripts}</script>`;
}
