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
    max: 6,
  },
  pomoData: [
    {
      pomoDate: {
        type: Date,
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
  streak: {
    type: Number,
    default: 0,
    
  },
});

module.exports = mongoose.model('User', UserSchema);
