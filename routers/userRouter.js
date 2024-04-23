const { getUserData } = require('../controllers/userController.js');
const { authenticate } = require('../middlewares.js');

const router = require('express').Router();

router.get('/getUserData', authenticate, getUserData);

module.exports = router;
