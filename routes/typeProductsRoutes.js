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

router.get('/', typeProductsController.getAllTypeProducts); //ok
router.get('/:id', typeProductsController.getTypeProductsById); //ok
router.post('/', typeProductsController.createTypeProducts); //ok
router.delete('/:id', typeProductsController.deleteTypeProducts); //ok

module.exports = router;