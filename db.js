const { Pool } = require('pg');

// Utiliser la variable d'environnement DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Utilisation de l'URL de connexion
  ssl: {
    rejectUnauthorized: false, // Nécessaire pour la connexion SSL sur Railway
  },
});

module.exports = pool;