const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JoinSchema = new Schema(
  {
    room: {
      type: String,
      required: [true, "Room ID cannot be empty."],
      trim: true,
      minlength: 10,
      maxlength: 20,
    },
  },
  { collection: "roomID", timestamps: true }
);

const Join = mongoose.model("Join", JoinSchema);

module.exports = Join;
