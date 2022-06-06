const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      require: true,
      min: 2,
      max: 32,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    nickname: {
      type: String,
      min: 2,
      max: 20
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3]
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
