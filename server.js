const fs = require("fs");
const path = require("path");

process.chdir(__dirname);
loadEnvFiles(__dirname);

const standaloneServer = path.join(__dirname, ".next", "standalone", "server.js");
const nextServer = path.join(__dirname, ".next", "server.js");

if (fs.existsSync(nextServer)) {
  require(nextServer);
} else if (fs.existsSync(standaloneServer)) {
  require(standaloneServer);
} else {
  console.error("No está el build de Next. Ejecuta npm run build antes de arrancar.");
  process.exit(1);
}

/// cPanel a veces arranca `node server.js` sin cargar `.env`. Las variables que
/// ya vengan del panel tienen prioridad: este archivo solo rellena las que faltan.
function loadEnvFiles(directory) {
  const merged = new Map();

  for (const name of [".env", ".env.local", ".env.production"]) {
    const filePath = path.join(directory, name);

    if (!fs.existsSync(filePath)) continue;

    for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");

      if (separator <= 0) continue;

      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      merged.set(key, value);
    }
  }

  for (const [key, value] of merged) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
