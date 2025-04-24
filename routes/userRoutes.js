const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userModel = require('../models/userModel');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

// Créer un utilisateur
router.post('/', authController.registerUser); //ok

// Obtenir tous les utilisateurs
router.get('/', authController.getAllUsers);//ok

// Obtenir un utilisateur par son nom d'utilisateur
router.get('/mail',authController.getUserByMail); //ok

//Route pour modifé le role user 

router.put('/updateRole' ,authController.updateUserRole)//ok

// Route pour la connexion
router.post('/login', authController.loginUser); //ok

module.exports = router;