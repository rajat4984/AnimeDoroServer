const {
  login,
  register,
  sendOtp,
} = require('../controllers/authController.js');

const router = require('express').Router();

router.post('/sendOtp', sendOtp);
router.post('/login', login);
router.post('/register', register);

module.exports = router;
