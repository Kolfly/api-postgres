require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())

// Importation des routes
const productRoutes = require('../routes/productRoutes.js');
const menusRoutes = require('../routes/menusRoutes.js');
const commandRoutes = require('../routes/commandRoutes.js');
const userRoutes = require('../routes/userRoutes.js'); 

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes pour les produits
app.use('/products', productRoutes);

// Routes pour les menus
app.use('/menus', menusRoutes);

// Routes pour les commandes
app.use('/commands', commandRoutes);

// Routes pour les utilisateurs
app.use('/users', userRoutes); // ✅ Routes pour utilisateurs

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}`);
  console.log('lancement...');
});