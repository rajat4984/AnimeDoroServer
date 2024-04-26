const {
  getUserData,
  addPomoData,
  getPomoData,
} = require('../controllers/userController.js');
const { authenticate } = require('../middlewares.js');

const router = require('express').Router();

router.get('/getUserData', authenticate, getUserData);
router.post('/addPomoData', authenticate, addPomoData);
router.post('/getPomoData', authenticate, getPomoData);

module.exports = router;
