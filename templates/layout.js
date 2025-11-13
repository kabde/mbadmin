// ===== TEMPLATE LAYOUT BOOTSTRAP 5 - W-AffBooster =====
// Layout principal avec Bootstrap 5 et design admin moderne

export function getAdminLayout(title, content, activePage, user) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Admin MBA</title>
  
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <!-- Quill.js CSS -->
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
  <!-- Custom Admin CSS -->
  <link rel="stylesheet" href="/styles/admin.css?v=${Date.now()}">
</head>
<body class="bg-light">
  <!-- Sidebar -->
  ${getSidebarHTML(activePage, user)}
  
  <!-- Main Content -->
  <div class="main-content">
    <!-- Top Navigation -->
    ${getTopNavHTML(user)}
    
    <!-- Page Content -->
    <div class="container-fluid py-4">
      ${content}
    </div>
    
    <!-- Footer -->
    ${getFooterHTML()}
  </div>

  <!-- Bootstrap 5 JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Quill.js JS -->
  <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
  <!-- Custom Admin JS -->
  <script>
    ${getLayoutScripts()}
  </script>
</body>
</html>`;
}

export function getSidebarHTML(activePage, user) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', active: activePage === '/dashboard' },
    { href: '/profile', label: 'Profile', icon: 'bi-person', active: activePage === '/profile' },
    { href: '/programs', label: 'Programs', icon: 'bi-book', active: activePage === '/programs' },
      { href: '/classes', label: 'Classes', icon: 'bi-collection', active: activePage === '/classes' },
      { href: '/schools', label: 'Écoles', icon: 'bi-building', active: activePage === '/schools' },
      { href: '/quizzes', label: 'Quiz', icon: 'bi-question-circle', active: activePage === '/quizzes' },
      { href: '/courses', label: 'Cours', icon: 'bi-mortarboard', active: activePage === '/courses' },
      { href: '/modules', label: 'Modules', icon: 'bi-collection', active: activePage === '/modules' },
      { href: '/videos', label: 'Videos', icon: 'bi-play-circle', active: activePage === '/videos' },
      { href: '/speakers', label: 'Formateurs', icon: 'bi-people', active: activePage === '/speakers' },
      { href: '/members', label: 'Membres', icon: 'bi-person-badge', active: activePage === '/members' },
      { href: '/school-fields', label: 'Champs École', icon: 'bi-gear', active: activePage === '/school-fields' },
      { href: '/reclamations', label: 'Réclamations', icon: 'bi-exclamation-triangle', active: activePage === '/reclamations' },
      { href: '/support', label: 'Support', icon: 'bi-headset', active: activePage === '/support' }
    ];

  return `
    <!-- Sidebar -->
    <nav class="sidebar bg-dark text-white" id="sidebar">
      <div class="sidebar-header p-3 border-bottom border-secondary">
        <div class="d-flex align-items-center">
          <div class="sidebar-brand-icon me-2">
            <i class="bi bi-bullseye fs-4 text-primary"></i>
          </div>
          <span class="sidebar-brand-text fw-bold">Admin MBA</span>
        </div>
        <button class="btn-close btn-close-white d-lg-none" onclick="toggleSidebar()"></button>
      </div>
      
      <div class="sidebar-nav p-3">
        <ul class="nav nav-pills flex-column">
          ${navItems.map(item => `
            <li class="nav-item mb-1">
              <a href="${item.href}" class="nav-link ${item.active ? 'active' : 'text-white-50'} d-flex align-items-center">
                <i class="${item.icon} me-3"></i>
                <span>${item.label}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <div class="sidebar-footer p-3 border-top border-secondary mt-auto">
        <div class="d-flex align-items-center mb-3">
          <div class="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
            ${user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="fw-bold">${user.username}</div>
            <small class="text-white-50">Affiliate Partner</small>
          </div>
        </div>
        <button class="btn btn-outline-light btn-sm w-100" onclick="logout()">
          <i class="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </nav>
    
    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay d-lg-none" id="sidebarOverlay" onclick="closeSidebar()"></div>
  `;
}

export function getTopNavHTML(user) {
  return `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div class="container-fluid">
        <button class="btn btn-link d-lg-none" onclick="toggleSidebar()">
          <i class="bi bi-list fs-4"></i>
        </button>
        
        <div class="navbar-nav ms-auto">
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
              <div class="avatar bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                ${user.username.charAt(0).toUpperCase()}
              </div>
              <span>${user.username}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/profile"><i class="bi bi-person me-2"></i>Profile</a></li>
              <li><a class="dropdown-item" href="/settings"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function getFooterHTML() {
  return `
    <footer class="bg-white border-top py-3 mt-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0 text-muted small">
              <i class="bi bi-mortarboard me-1"></i>
              &copy; 2024 Admin MBA - Plateforme e-learning
            </p>
          </div>
          <div class="col-md-6 text-end">
            <small class="text-muted">Gestion des cours et accès pour les écoles</small>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function getLayoutScripts() {
  return `
    // Sidebar functions
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    }
    
    function closeSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    }
    
    async function logout() {
      try {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
      }
    }
    
    // Newsletter subscription
    async function subscribeNewsletter(e) {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (response.ok) {
          alert('Successfully subscribed to newsletter!');
          e.target.reset();
        } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'Failed to subscribe'));
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert('Error subscribing to newsletter. Please try again.');
      }
    }
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });
    
    // Close sidebar when clicking on nav links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
    
    // Quill.js initialization function
    window.initQuill = function(elementId, options = {}) {
      const defaultOptions = {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
          ]
        },
        placeholder: 'Saisissez votre contenu...'
      };
      
      const finalOptions = { ...defaultOptions, ...options };
      return new Quill(elementId, finalOptions);
    };
    
    // Auto-initialize Quill editors on page load
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize all textareas with class 'quill-editor'
      document.querySelectorAll('textarea.quill-editor').forEach(textarea => {
        const container = document.createElement('div');
        container.style.height = '200px';
        textarea.parentNode.insertBefore(container, textarea);
        textarea.style.display = 'none';
        
        const quill = window.initQuill(container);
        
        // Set initial content
        if (textarea.value) {
          quill.root.innerHTML = textarea.value;
        }
        
        // Update textarea when Quill content changes
        quill.on('text-change', function() {
          textarea.value = quill.root.innerHTML;
        });
      });
    });
  `;
}
