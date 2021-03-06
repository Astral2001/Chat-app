const router = require('express').Router();
const Conversation = require('../model/Conversation')

// new conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderID, req.body.receiverID]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    } catch (err) {
        res.status(500).json(err);
    }
})

// get conversations of a user
router.get("/:userID", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userID]}
        })

        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router