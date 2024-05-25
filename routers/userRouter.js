const {
  getUserData,
  addPomoData,
  getPomoData,
  getUserAnimeList,
} = require('../controllers/userController.js');
const { authenticate } = require('../middlewares.js');

const router = require('express').Router();

router.get('/getUserData', authenticate, getUserData);
router.post('/addPomoData',authenticate, addPomoData);
router.post('/getPomoData', authenticate, getPomoData);
router.get("/getUserAnimeList",getUserAnimeList);

module.exports = router;
