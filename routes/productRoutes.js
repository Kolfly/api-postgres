const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Route pour obtenir tous les produits
router.get('/', productController.getAllProducts);

// Route pour obtenir un produit par ID
router.get('/id', productController.getProductById);

// Route pour créer un nouveau produit
router.post('/',authenticateToken,authorizeRole('manager'), productController.createProduct);

// Route pour mettre à jour un produit existant
router.put('/id',authenticateToken,authorizeRole('manager'), productController.updateProduct);

// Route pour supprimer un produit
router.delete('/id',authenticateToken,authorizeRole('manager'), productController.deleteProduct);

module.exports = router;
