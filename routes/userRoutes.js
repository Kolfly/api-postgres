const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userModel = require('../models/userModel');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

// Créer un utilisateur
router.post('/', authController.registerUser); //ok swagger

// Obtenir tous les utilisateurs
router.get('/', authController.getAllUsers);//ok swagger

// Obtenir un utilisateur par son mail
router.get('/mail',authController.getUserByMail); //ok swagger

//Route pour modifé le role user 

router.put('/updateRole' ,authController.updateUserRole)//ok swagger

// Route pour la connexion
router.post('/login', authController.loginUser); //ok swagger

module.exports = router;