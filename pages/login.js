// ===== PAGE LOGIN - Admin MBA =====
// Page de connexion pour plateforme e-learning

export function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Admin MBA</title>
  
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="/styles/admin.css?v=${Date.now()}">
</head>
<body class="bg-light">
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <!-- Left Side - Branding -->
      <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-gradient-primary">
        <div class="text-center text-white">
          <div class="mb-4">
            <i class="bi bi-mortarboard" style="font-size: 4rem;"></i>
          </div>
          <h1 class="display-4 fw-bold mb-3">Admin MBA</h1>
          <p class="fs-5 opacity-75">Plateforme e-learning pour la gestion des cours et accès pour les écoles.</p>
        </div>
      </div>
      
      <!-- Right Side - Login Form -->
      <div class="col-lg-6 d-flex align-items-center justify-content-center">
        <div class="w-100" style="max-width: 400px;">
          <div class="text-center mb-4">
            <div class="d-lg-none mb-3">
              <i class="bi bi-mortarboard text-primary" style="font-size: 3rem;"></i>
            </div>
            <h2 class="fw-bold text-dark">Connexion École</h2>
            <p class="text-muted">Accédez à votre espace de gestion des cours</p>
          </div>
          
          <div class="card shadow-lg border-0">
            <div class="card-body p-4">
              <div id="alert" class="alert d-none"></div>
              
              <form onsubmit="handleLogin(event)">
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">Email de l'école</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-building"></i>
                    </span>
                    <input type="email" class="form-control form-control-lg" id="email" name="email" placeholder="admin@ecole.edu" required>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label fw-semibold">Mot de passe</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input type="password" class="form-control form-control-lg" id="password" name="password" required>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="remember" name="remember">
                    <label class="form-check-label" for="remember">
                      Se souvenir de moi
                    </label>
                  </div>
                  <a href="/forgot-password" class="text-decoration-none">Mot de passe oublié?</a>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
                </button>
              </form>
              
              <div class="text-center">
                <p class="text-muted mb-0">Nouvelle école? 
                  <a href="/register" class="text-decoration-none fw-semibold">Demander un accès</a>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Features -->
          <div class="row g-3 mt-4">
            <div class="col-4 text-center">
              <div class="p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-book text-primary fs-4"></i>
                <div class="small text-muted mt-1">Cours</div>
              </div>
            </div>
            <div class="col-4 text-center">
              <div class="p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-people text-success fs-4"></i>
                <div class="small text-muted mt-1">Étudiants</div>
              </div>
            </div>
            <div class="col-4 text-center">
              <div class="p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-graph-up text-warning fs-4"></i>
                <div class="small text-muted mt-1">Suivi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap 5 JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  
  <script>
    async function handleLogin(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const alert = document.getElementById('alert');
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Signing in...';
      
      try {
        const response = await fetch('/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          showAlert('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          const error = await response.json();
          showAlert(error.error || 'Invalid credentials', 'danger');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (error) {
        console.error('Login error:', error);
        showAlert('Connection error. Please try again.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
    
    function showAlert(message, type) {
      const alert = document.getElementById('alert');
      alert.className = \`alert alert-\${type}\`;
      alert.innerHTML = \`
        <i class="bi bi-\${type === 'danger' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
        \${message}
      \`;
      alert.classList.remove('d-none');
      
      setTimeout(() => {
        alert.classList.add('d-none');
      }, 5000);
    }
  </script>
</body>
</html>`;
}