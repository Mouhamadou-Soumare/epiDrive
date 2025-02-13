const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "logs", "server.log");
const logErrorPath = path.join(__dirname, "logs", "error.log");

const logToFile = (message, type = "info") => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;

  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }

  try {
    fs.appendFileSync(type === "error" ? logErrorPath : logFilePath, logMessage, "utf8");
  } catch (err) {
    console.error("Erreur lors de l'écriture du log :", err);
  }
};

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0"; 
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  logToFile(" Next.js app is being prepared...");

  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    logToFile(`📥 Requête reçue: ${req.method} ${req.url}`);

    try {
      if (pathname.startsWith("/api")) {
        logToFile(`🛠 Traitement d'une API: ${pathname}`);
      }

      await handle(req, res, parsedUrl);

      logToFile(` Requête traitée avec succès: ${req.method} ${req.url}`);
    } catch (err) {
      console.error("Erreur sur la requête", req.url, err);
      logToFile(` Erreur sur la requête: ${req.url} - ${err.stack}`, "error");

      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, (err) => {
    if (err) {
      logToFile(` Erreur au démarrage du serveur: ${err.message}`, "error");
      throw err;
    }
    logToFile(` Serveur lancé sur http://${hostname}:${port}`);
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

// Gestion des erreurs globales
process.on("uncaughtException", (err) => {
  console.error(" Exception non capturée :", err);
  logToFile(` Uncaught Exception: ${err.stack}`, "error");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(" Rejet non géré :", reason);
  logToFile(` Unhandled Rejection: ${reason}`, "error");
});
