const express = require('express');
const secretMessageController=require("../Controllers/secretMessage-controller")
const router = express.Router();

// Route to create a secret message
router.post('/', secretMessageController.createMessage);

// Route to access a secret message
router.get('/:share_url/:userId', secretMessageController.getMessage);

module.exports = router;
