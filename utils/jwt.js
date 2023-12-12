const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!Boolean(token)) {
    return res
      .status(401)
      .send("Auth token is required in format [Bearer xxx]");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid auth token");
    req.user = user;
    next();
  });
};

let validRefreshTokens = [];

const createRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
  validRefreshTokens.push(refreshToken);
  return refreshToken;
};

const authRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!Boolean(refreshToken)) {
    return res.send(401).send("Refresh Token missing");
  }
  if (!validRefreshTokens.includes(refreshToken)) {
    return res.status(403).send("Forbidden");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token");
    req.user = user;
    next();
  });
};

const deleteRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!Boolean(refreshToken)) {
    return res.send(401).send("Refresh Token missing");
  }
  validRefreshTokens = validRefreshTokens.filter((rt) => rt !== refreshToken);
  next();
};

module.exports = {
  createAccessToken,
  authToken,
  createRefreshToken,
  authRefreshToken,
  deleteRefreshToken,
};
