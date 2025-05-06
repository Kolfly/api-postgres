const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController'); 
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

router.get('/', commandController.getAllCommands);//ok swagger

router.get('/:id', commandController.getCommandById);//ok swagger

router.post('/', commandController.addCommand);//ok swagger

router.put('/update', commandController.updateCommandStatus);//ok swagger

module.exports = router;
