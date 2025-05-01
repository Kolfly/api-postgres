const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController'); 
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

router.get('/',authenticateToken,authorizeRole(1,2,3), commandController.getAllCommands);//ok swagger

router.get('/:id',authenticateToken, commandController.getCommandById);//ok swagger

router.post('/',authenticateToken, commandController.addCommand);//ok swagger

router.put('/update',authenticateToken,authorizeRole(1,2,3), commandController.updateCommandStatus);//ok swagger

module.exports = router;
