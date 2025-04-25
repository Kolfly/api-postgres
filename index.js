require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./config/swaggerConfig.js'); // Assurez-vous que le fichier swaggerConfig.js existe
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
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
  console.log(' Documentation Swagger disponible sur http://localhost:3000/api-docs');
});
