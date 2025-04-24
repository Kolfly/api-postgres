const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Route pour obtenir tous les produits
router.get('/', productController.getAllProducts); // test ok

// Route pour obtenir un produit par ID
router.get('/:id', productController.getProductById); // test ok

// Route pour créer un nouveau produit
router.post('/',  productController.createProduct); // ok

// Route pour mettre à jour un produit existant
router.put('/', productController.updateProduct); //ok

// Route pour supprimer un produit
router.delete('/:id', productController.deleteProduct);// ok

// Route pour obtenir les produits par type
router.get('/type/:type', productController.getProductsByType); //ok

module.exports = router;
