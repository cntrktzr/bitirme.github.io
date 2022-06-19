const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty."],
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: [30, "Maximum 30 character."],
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: "user", timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
