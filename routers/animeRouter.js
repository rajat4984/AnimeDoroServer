const router = require('express').Router();
router.get("/",()=>{
    console.log("get request")
})

const {
  getAnimeList,
  getAnimeInfo,
} = require('../controllers/animeController');


router.get('/get-anime-list', getAnimeList);
router.get('/get-anime-info', getAnimeInfo);

module.exports = router;
