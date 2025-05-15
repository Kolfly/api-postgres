require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./config/swaggerConfig.js'); 
const app = express();

// Middleware CORS
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Importation des routes
const productRoutes = require('./routes/productRoutes.js');
const typeProductsRoutes = require('./routes/typeProductsRoutes.js');
const commandRoutes = require('./routes/commandRoutes.js');
const userRoutes = require('./routes/userRoutes.js'); 

// Intégration de Swagger
swaggerSetup(app);

// Routes pour les produits
app.use('/products', productRoutes);

// Routes pour les types de produits
app.use('/typeProducts', typeProductsRoutes);

// Routes pour les commandes
app.use('/commands', commandRoutes);

// Routes pour les utilisateurs
app.use('/users', userRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000; // Récupère PORT depuis .env ou utilise 3000 par défaut
const HOST = '0.0.0.0';  // écoute toutes les interfaces
app.listen(PORT,HOST, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
  console.log(' Documentation Swagger disponible sur http://localhost:3000/api-docs');
});
module.exports = app; // Exporter l'application pour les tests