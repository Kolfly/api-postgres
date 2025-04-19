const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userModel = require('../models/userModel');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

// Créer un utilisateur
router.post('/',authenticateToken, authController.registerUser);

// Obtenir tous les utilisateurs
router.get('/', authenticateToken, authorizeRole('manager'), authController.getAllUsers);

// Obtenir un utilisateur par son nom d'utilisateur
router.get('/:username',authenticateToken,authorizeRole('manager','preparateur','accueil'), async (req, res) => {
  const { username } = req.params;

  try {
    const result = await userModel.getUserByUsername(username);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}); 

//Route pour modifé le role user 

router.put('/updateRole' ,authenticateToken, authorizeRole('manager'),authController.updateUserRole)

// Route pour la connexion
router.post('/login', authController.loginUser);  

module.exports = router;