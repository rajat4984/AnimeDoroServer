const router = require('express').Router();

const {
  getAnimeList,
  getAnimeInfo,
  updateAnimeList,
} = require('../controllers/animeController');


router.get('/get-anime-list', getAnimeList);
router.post('/get-anime-info', getAnimeInfo);
router.put("/update-anime-list",updateAnimeList)

module.exports = router;
