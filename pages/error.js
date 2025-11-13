// ===== PAGE ERROR - W-AffBooster =====
// Page d'erreur générique

export function getErrorPage(message, status = 500) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${status} - Affiliate Manager</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <!-- Custom Admin CSS -->
  <link rel="stylesheet" href="/styles/admin.css?v=${Date.now()}">
  <!-- Google Fonts: Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center min-vh-100">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg border-0 rounded-lg">
          <div class="card-body text-center p-5">
            <div class="mb-4">
              <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
            </div>
            <h1 class="display-4 fw-bold text-dark mb-3">Error ${status}</h1>
            <p class="lead text-muted mb-4">${message}</p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <a href="/" class="btn btn-primary btn-lg">
                <i class="bi bi-house me-2"></i>Go Home
              </a>
              <button onclick="history.back()" class="btn btn-outline-secondary btn-lg">
                <i class="bi bi-arrow-left me-2"></i>Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}
