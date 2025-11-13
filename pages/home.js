// ===== PAGE HOME - Admin MBA =====
// Page d'accueil avec redirection vers mediabuying.ac

export function getHomePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin MBA - Redirection</title>
  <meta http-equiv="refresh" content="0; url=https://mediabuying.ac/">
  <script>
    // Redirection immédiate vers mediabuying.ac
    window.location.href = 'https://mediabuying.ac/';
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <h2>Redirection en cours...</h2>
    <p>Vous allez être redirigé vers <a href="https://mediabuying.ac/">mediabuying.ac</a></p>
    <p>Si la redirection ne fonctionne pas, <a href="https://mediabuying.ac/">cliquez ici</a></p>
    </div>
</body>
</html>`;
}