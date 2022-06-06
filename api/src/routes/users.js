const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

// CRUD
// Create a new user
// Read a username
// => Done with auth.js

// Update user
router.put('/:id', async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                res.status(500).json(err);
            }
        }

        // Can change self isAdmin, need to be updated
        // status: wrong
        if (req.body.isAdmin && !req.body.isAdmin) {
            return res.status(403).json("Only for admin users")
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });

            res.status(200).json("Your account has been updated !!!");
        } catch(err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can update only your account !!!")
    }
})

// Delete a user
router.delete('/:id', async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Your account has been deleted")
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can delete only your account!!!")
    }
})

// get a user
router.get("/", async (req, res) => {
    const userID = req.query.userID
    const username = req.query.username

    try {
        const user = userID
        ? await User.findById(userID)
        : await User.findOne({ username: username})
        // Not display password, updateTime
        const {password, updateAt, ...other} = user._doc;

        // display the other
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err)
    }
})

// follow a user
// based on update info
router.put("/:id/follow", async (req, res) => {
    if (req.body.userID !== req.params.id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userID);

        if(!user.followings.includes(req.body.userID)) {
            await user.updateOne({ $push: { followings: req.body.userID } });
            await currentUser.updateOne({ $push: { followers: req.params.id } });

            res.status(200).json("Users has been followed");
        } else {
            res.status(403).json("You already follow this user");
        }
    } else {
        return res.status(500).json("You can't follow yourself");
    }
})

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userID !== req.params.id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userID);

        if(user.followings.includes(req.body.userID)) {
            await user.updateOne({ $pull: { followers: req.body.userID } });
            await currentUser.updateOne({ $pull: { followings: req.params.id } });

            res.status(200).json("Users has been unfollowed");
        } else {
            res.status(403).json("You don't follow this user");
        }
    } else {
        return res.status(500).json("You can't unfollow yourself");
    }
})

module.exports = router;

// get friends
router.get("/friends/:userID", async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        const friends = await Promise.all(
            user.followings.map(friendID => {
                return User.findById(friendID)
            })
        )

        let friendList = [];
        friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        })

        res.status(200).json(friendList);
    } catch (err) {
        res.status(500).json(err)
    }
})