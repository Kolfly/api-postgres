const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController'); 
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

router.get('/commands',authenticateToken,authorizeRole('manager','preparateur','accueil'), commandController.getAllCommands);
router.get('/commands/:id',authenticateToken, commandController.getCommandById);
router.post('/commands',authenticateToken,authorizeRole('client','accueil','manager'), commandController.addCommand);
router.put('/commands',authenticateToken,authorizeRole('manager','accueil','preparateur'), commandController.updateCommandStatus);
module.exports = router;
