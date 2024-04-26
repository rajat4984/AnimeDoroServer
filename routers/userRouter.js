const {
  getUserData,
  addPomoData,
} = require('../controllers/userController.js');
const { authenticate } = require('../middlewares.js');

const router = require('express').Router();

router.get('/getUserData', authenticate, getUserData);
router.post('/addPomoData', addPomoData);

module.exports = router;
