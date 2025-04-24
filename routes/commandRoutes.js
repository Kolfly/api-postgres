const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController'); 
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole'); 

router.get('/', commandController.getAllCommands);//ok
router.get('/:id', commandController.getCommandById);//ok
router.post('/', commandController.addCommand);//ok
router.put('/update', commandController.updateCommandStatus);//ok
module.exports = router;
