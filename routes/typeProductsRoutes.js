const express = require('express');
const router = express.Router();

const typeProductsController = require('../controllers/typeProductsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// TEST route
router.get('/test', (req, res) => {
  console.log('>>> Route /TypeProducts/test appelée');
  res.send('TypeProducts route fonctionne ✅');
});

router.get('/',authenticateToken,authorizeRole(1,2), typeProductsController.getAllTypeProducts); //ok
router.get('/:id',authenticateToken, typeProductsController.getTypeProductsById); //ok
router.post('/',authenticateToken,authorizeRole(1), typeProductsController.createTypeProducts); //ok
router.delete('/:id',authenticateToken,authorizeRole(1), typeProductsController.deleteTypeProducts); //ok

module.exports = router;