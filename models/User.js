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
    max:6
  },
  pomoData: [
    {
      pomoDate: {
        type: String,
        required: true,
      },
      NoOfPomo: {
        type: Number,
        default: 0,
        required: true,
      },
      TotalTime: {
        type: Number,
        required: true,
      },

      _id: false,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);