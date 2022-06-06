const router = require('express').Router();
const Post = require('../model/Post');
const User = require('../model/User');
const { route } = require('./auth');

// Create a post
router.post('/', async (req, res) => {
    const newPost = await new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userID === req.body.userID) {
            await post.updateOne( {$set: req.body} )
            res.status(200).json("Your post has been updated")
        } else {
            res.status(403).json("You can update only your post");
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (post.userID === req.body.userID) {
            await post.deleteOne();
            res.status(200).json("Your post has been deleted");
        } else {
            res.status(403).json("You can delete only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Like and dislike a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post.likes.includes(req.body.userID)) {
            await post.updateOne({ $push: { likes: req.body.userID } });
            res.status(200).json("Liked the post");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userID } })
            res.status(200).json("Disliked the post");
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/timeline/:userID', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userID)
        const userPosts = await Post.find({ userID: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendID) => {
                return Post.find({ userID: friendID });
            })
        )

        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get user's all posts
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username})
        console.log('user:', user)
        const posts = await Post.find({ userID: user._id})

        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;