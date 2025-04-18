const express = require('express');
const router = express.Router();

const menusController = require('../controllers/menusController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// TEST route
router.get('/test', (req, res) => {
  console.log('>>> Route /menus/test appelée');
  res.send('Menus route fonctionne ✅');
});

router.get('/',authenticateToken, menusController.getAllMenus);
router.get('/:id',authenticateToken, menusController.getMenuById);
router.post('/',authenticateToken,authorizeRole('manager'), menusController.createMenu);
router.delete('/:id',authenticateToken,authorizeRole('manager'), menusController.deleteMenu);

module.exports = router;