const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  let accessToken = req.headers.authorization;
  let refreshToken;

  req.headers.cookie?.split('; ').map((item) => {
    if (item.split('=')[1] == 'refresh_token') {
      refreshToken = item.split('=')[0];  
    }
  });

  if (!accessToken && !refreshToken)
    return res.status(401).json('Access denied No token provided');

  try {
    accessToken = accessToken?.split(' ')[1];
    const decoded = jwt.verify(accessToken, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json("Access Token expired");
  }

    if (!refreshToken)
      return res.status(401).json('Access denied No refresh token provided');

    try {
      const decoded = jwt.verify(refreshToken, jwtSecret);
      const accessToken = jwt.sign({ user: decoded.user }, jwtSecret, {
        expiresIn: '1h',
      });
      res.cookie(refreshToken, 'refresh_token', {
        httpOnly: true,
        sameSite: 'strict',
      });
      return res
        .status(200)
        .header('Authorization', accessToken)
        .json('Token refreshed');
    } catch (error) {
      console.log(error);
      return res.status(400).send('Please login again');
    }
  
};

module.exports = { authenticate };
