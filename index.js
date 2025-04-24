require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Routes pour les produits
app.use('/products', productRoutes);

// Routes pour les menus
app.use('/typeProducts', typeProductsRoutes);

// Routes pour les commandes
app.use('/commands', commandRoutes);

// Routes pour les utilisateurs
app.use('/users', userRoutes); // ✅ Routes pour utilisateurs

// Démarrer le serveur
const PORT = process.env.PORT || 3000; // Récupère PORT depuis .env ou utilise 3000 par défaut
app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}`);
  console.log('lancement...');
});
