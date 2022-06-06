const router = require('express').Router();
const User = require('../model/User')
const bcrypt = require('bcrypt')

// Register aka Create a user
router.post("/register", async (req, res) => {

    try {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // Save the new user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Login aka Read a user
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user)
        res.status(404).json('user not found');
    else {
        // Check the valid hashed password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword)
            res.status(400).json("wrong password");
        else
            res.status(200).json(user);
    }
})

module.exports = router;
