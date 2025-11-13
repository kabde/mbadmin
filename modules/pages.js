// ===== MODULE PAGES - W-AffBooster =====
// Module de gestion des pages (maintenant vide - pages extraites vers /pages/)

export class PagesModule {
  constructor() {
    this.env = null;
  }

  // Initialisation avec l'environnement
  init(env) {
    this.env = env;
  }

  // ===== UTILITAIRES =====

  // Template de page générique
  getPageTemplate(title, content, user = null) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Affiliate Manager</title>
  <link rel="stylesheet" href="https://cdn-d6u.pages.dev/styles.css?v=${Date.now()}">
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>`;
  }
}