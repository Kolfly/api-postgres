const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

router.get('/multi', productController.getProductsByIds);

// Route pour obtenir tous les produits
router.get('/', productController.getAllProducts); // test ok  swagger

// Route pour obtenir un produit par ID
router.get('/:id', productController.getProductById); // test ok swagger

// Route pour créer un nouveau produit
router.post('/',  productController.createProduct); // ok swagger

// Route pour mettre à jour un produit existant
router.put('/', productController.updateProduct); //ok swagger

// Route pour supprimer un produit
router.delete('/:id', productController.deleteProduct);// ok swagger

// Route pour obtenir les produits par type
router.get('/type/:type', productController.getProductsByType); //ok swager



module.exports = router;
