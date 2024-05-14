const axios = require('axios');

const getAnimeList = async (req, res) => {
  console.log(req.query.searchValue, 'que');
  console.log(req.params.searchValue, 'param');
  try {
    const response = await axios(
      `https://api.myanimelist.net/v2/anime?q=${req.query.searchValue}&limit=7`,
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
      `https://api.myanimelist.net/v2/anime/${req.query.id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`,
      {
        headers: { Authorization: `Bearer ${req.query.access_token}` },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAnimeList,
  getAnimeInfo,
};
