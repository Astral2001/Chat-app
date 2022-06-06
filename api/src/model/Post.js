const mongoose = require('mongoose');

// Post user's status on web
const PostSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 1000,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
},
{ timestamps: true, }
)

module.exports = mongoose.model('Post', PostSchema);