const User = require('../models/User');

const getUserData = async (req, res) => {
  res.status(200).json('user data');
};

const addPomoData = async (req, res) => {
  const { userId, minutes } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json('User not found');

    const date = new Date().toISOString().split('T')[0];
    console.log(date, 'date');
    console.log(user.pomoData[0], 'Hello');

    if (user.pomoData[0]) {
      if (user.pomoData[0].pomoDate == date) {
        user.pomoData[0].NoOfPomo++;
        user.pomoData[0].TotalTime += Number(minutes);
      } else {
        user.pomoData.unshift({
          pomoDate: date,
          NoOfPomo: 1,
          TotalTime: minutes,
        });
      }
    } else {
      user.pomoData.unshift({
        pomoDate: date,
        NoOfPomo: 1,
        TotalTime: minutes,
      });
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json('Cannot add data Internal server error');
  }
};

module.exports = {
  getUserData,
  addPomoData,
};
