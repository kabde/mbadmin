// ===== PAGE MAINTENANCE - W-AffBooster =====
// Page de maintenance

export function getMaintenancePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maintenance - Affiliate Manager</title>
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
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-lg border-0 rounded-lg">
          <div class="card-body text-center p-5">
            <div class="mb-4">
              <i class="bi bi-tools text-warning" style="font-size: 4rem;"></i>
            </div>
            <h1 class="display-4 fw-bold text-dark mb-3">System Maintenance</h1>
            <p class="lead text-muted mb-4">We're currently performing maintenance on our system. Please check back later.</p>
            <div class="alert alert-info d-inline-block">
              <i class="bi bi-clock me-2"></i>
              <strong>Expected completion:</strong> 30 minutes
            </div>
            <div class="mt-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">We'll be back soon!</p>
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
