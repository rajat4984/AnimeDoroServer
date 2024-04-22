const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pomoData: [
    {
      pomoDate: {
        type: Date,
        required: true,
      },
      NoOfPomo: {
        type: Number,
        required: true,
      },
      TotalTime: {
        type: Number,
        required: true,
      },
    },
  ],
});


module.exports = mongoose.model("User",UserSchema);
