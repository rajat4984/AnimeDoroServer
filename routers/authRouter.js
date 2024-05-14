const {
  login,
  register,
  sendOtp,
  animeProxy,
  getToken,
  getProfileInfo,
} = require('../controllers/authController.js');

const router = require('express').Router();

router.post('/sendOtp', sendOtp);
router.post('/login', login);
router.post('/register', register);
router.get('/anime-proxy', animeProxy);
router.post('/get-token', getToken);
router.get('/get-profile-info', getProfileInfo);

module.exports = router;
