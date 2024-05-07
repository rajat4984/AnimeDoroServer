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
    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterDay = yesterdayDate.toISOString().split('T')[0];

    let isStreak = false;

    user.pomoData.forEach((item) => {
      console.log(user.streak,'sterak');
      console.log(user.pomoData.length,'legnth')
      if (item.pomoDate == yesterDay && user.streak < user.pomoData.length) {
        user.streak++;
      }
    });

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

    if (user.streak === 0) user.streak = 1;

    await user.save();
    let { password, ...userData } = user._doc;
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Cannot add data Internal server error');
  }
};

const getPomoData = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json('User not found');

    return res.status(200).json({ pomoData: user.pomoData });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Cannot get Pomodata internal server error');
  }
};

module.exports = {
  getUserData,
  addPomoData,
  getPomoData,
};
