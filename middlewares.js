const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  let accessToken = req.headers.authorization;
  let refreshToken;

  // Extract cookies from the headers and parse them correctly
  req.headers.cookie?.split("; ").forEach((item) => {
    const [key, value] = item.split("="); // Split the cookie into key and value
    if (key === "refresh_token") {
      // Compare the key with "refresh_token"
      refreshToken = value; // Assign the value of the cookie
    }
  });

  if (!accessToken && !refreshToken)
    return res.status(401).json("Access denied No token provided");

  try {
    accessToken = accessToken?.split(" ")[1];
    const decoded = jwt.verify(accessToken, jwtSecret);
    req.user = decoded.user;
    return next();
  } catch (error) {
    if (!refreshToken)
      return res.status(401).json("Access denied No refresh token provided");

    try {
      const decoded = jwt.verify(refreshToken, jwtSecret);
      const newAccessToken = jwt.sign({ user: decoded.user }, jwtSecret, {
        expiresIn: "1h",
      });
      const newRefreshToken = jwt.sign({ user: decoded.user }, jwtSecret, {
        expiresIn: "1d",
      });

      return res
        .status(200)
        .header("Authorization", newAccessToken)
        .cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json("Token refreshed");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Please login again");
    }
  }
};

module.exports = { authenticate };
