const router = require('express').Router();
const Message = require('../model/Message')

// add message
router.post("/", async (req, res) => {
    const newMessage = new Message(req.body)
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get message
router.get("/:conversationID", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationID: req.params.conversationID
        });
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router