const User = require("../models/User");
const { startOfDay } = require("date-fns");
const axios = require("axios");

const getUserData = async (req, res) => {
  res.status(200).json("user data");
};

const addPomoData = async (req, res) => {
  const { userId, minutes } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    const currentDate = startOfDay(new Date());
    const yesterDay = currentDate.getDate() - 1;

    user.pomoData.forEach((item) => {
      if (item.pomoDate == yesterDay && user.streak < user.pomoData.length) {
        user.streak++;
      }
    });

    if (user.pomoData[0]) {
      console.log(user.pomoData[0], "pomoData");
      if (user.pomoData[0].pomoDate.getTime() == currentDate.getTime()) {
        user.pomoData[0].NoOfPomo++;
        user.pomoData[0].TotalTime += Number(minutes);
      } else {
        user.pomoData.unshift({
          pomoDate: currentDate,
          NoOfPomo: 1,
          TotalTime: minutes,
        });
        user.streak++;
      }
    } else {
      user.pomoData.unshift({
        pomoDate: currentDate,
        NoOfPomo: 1,
        TotalTime: minutes,
      });
      user.streak++;
    }

    if (user.streak === 0) user.streak = 1;

    await user.save();
    let { password, ...userData } = user._doc;
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json("Cannot add data Internal server error");
  }
};

const getPomoData = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    return res
      .status(200)
      .json({ pomoData: user.pomoData, streak: user.streak });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Cannot get Pomodata internal server error");
  }
};

const getUserAnimeList = async (req, res) => {
  try {
    const response = await axios(
      "https://api.myanimelist.net/v2/users/Asta_ackerman/animelist?sort=list_updated_at",
      {
        headers: {
          Authorization: `Bearer ${req.query.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal erver error");
  }
};

module.exports = {
  getUserData,
  addPomoData,
  getPomoData,
  getUserAnimeList,
};
