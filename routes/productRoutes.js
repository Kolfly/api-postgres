const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Route pour obtenir tous les produits
router.get('/',authenticateToken, productController.getAllProducts); // test ok  swagger

// Route pour obtenir un produit par ID
router.get('/:id',authenticateToken, productController.getProductById); // test ok swagger

// Route pour créer un nouveau produit
router.post('/',authenticateToken,authorizeRole(1),  productController.createProduct); // ok swagger

// Route pour mettre à jour un produit existant
router.put('/',authenticateToken,authorizeRole(1), productController.updateProduct); //ok swagger

// Route pour supprimer un produit
router.delete('/:id',authenticateToken,authorizeRole(1), productController.deleteProduct);// ok swagger

// Route pour obtenir les produits par type
router.get('/type/:type',authenticateToken, productController.getProductsByType); //ok swager

module.exports = router;
