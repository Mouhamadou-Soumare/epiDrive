const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Fonction pour écrire les logs dans un fichier
const logFilePath = path.join(__dirname, 'logs', 'server.log');
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Créer le dossier logs s'il n'existe pas
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }

  // Écrire dans le fichier de logs
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
};

// Définition des variables d'environnement
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  logToFile('🚀 Next.js app is being prepared...');

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      logToFile(`📥 Incoming request: ${req.method} ${req.url}`);

      if (pathname === '/a') {
        await app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query);
      } else {
        await handle(req, res, parsedUrl);
      }

      logToFile(`✅ Successfully handled request: ${req.method} ${req.url}`);
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err);
      logToFile(`❌ Error handling request: ${req.url} - ${err.message}`);

      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, (err) => {
    if (err) {
      logToFile(`❌ Server startup error: ${err.message}`);
      throw err;
    }
    logToFile(`✅ Server ready at http://${hostname}:${port}`);
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  logToFile(`❌ Uncaught Exception: ${err.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  logToFile(`❌ Unhandled Rejection: ${reason}`);
});
