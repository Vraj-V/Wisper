const SecretMessage = require('../models/secretmessage');
const { v4: uuidv4 } = require('uuid');

const createMessage = async (req, res, next) => {
    const { message,expiry  } = req.body;

    console.log(message,expiry )
    if (!message) {
        return res.status(400).json({ message: 'Secret message is required' });
    }

    const share_url = uuidv4();  // Generate a unique URL for the secret
    const newSecret = new SecretMessage({ message,expiry, share_url });

    await newSecret.save();
    res.json({ share_url });
}

// GET endpoint to retrieve a secret message (accessed once per user)
const getMessage = async (req, res) => {
    const { share_url, userId } = req.params;

    console.log(share_url,userId)
    const secretMessage = await SecretMessage.findOne({ share_url });
  console.log(secretMessage);
    if (!secretMessage) {
        return res.status(404).json({ message: 'Secret not found' });
    }

    // Check if the user has already accessed the secret
    if (secretMessage.accessedUsers.includes(userId)) {
        return res.status(200).json({ message: 'You have already accessed this secret.' });
    }

    // Add the user to the accessed list
    secretMessage.accessedUsers.push(userId);
    await secretMessage.save();

    res.json({ message: secretMessage.message });
}


exports.createMessage = createMessage;
exports.getMessage = getMessage;