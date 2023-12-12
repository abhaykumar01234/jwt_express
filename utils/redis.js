const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

function storeRefreshToken(refreshToken, userId) {
  // Store the refresh token in Redis with an expiration time of 7 days
  return setAsync(refreshToken, userId, "EX", 7 * 24 * 60 * 60);
}

async function deleteRefreshToken(refreshToken) {
  // Delete the refresh token from Redis
  await delAsync(refreshToken);
}

async function getUserIdFromRefreshToken(refreshToken) {
  // Get the user ID associated with the refresh token from Redis
  const userId = await getAsync(refreshToken);
  return userId;
}

module.exports = {
  storeRefreshToken,
  deleteRefreshToken,
  getUserIdFromRefreshToken,
};
