const axios = require('axios');

const getAnimeList = async (req, res) => {
  console.log(req.query.searchValue, 'que');
  console.log(req.params.searchValue, 'param');
  try {
    const response = await axios(
      `https://api.myanimelist.net/v2/anime?q=${req.query.searchValue}&limit=50`,
      {
        headers: { Authorization: `Bearer ${req.query.accessToken}` },
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
  }
};

const getAnimeInfo = async (req, res) => {
  try {
    const response = await axios(
      `https://api.myanimelist.net/v2/anime/${req.body.id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`,
      {
        headers: { Authorization: `Bearer ${req.body.access_token}` },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log('Helohelohelo');
    console.log(error.message, 'getanimeinfo');
  }
};

const updateAnimeList = async (req, res) => {
  let payload = {};
  if (req.body.accessToken !== 0) {
    payload.num_watched_episodes = req.body.access_token;
  }
  try {
    const response = await axios.put(
      `https://api.myanimelist.net/v2/anime/${req.body.animeId}/my_list_status`,
      payload,
      {
        headers: { Authorization: `Bearer ${req.body.access_token}` },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      'Error updating anime list status:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json('Internal server error');
  }
};

module.exports = {
  getAnimeList,
  getAnimeInfo,
  updateAnimeList,
};
