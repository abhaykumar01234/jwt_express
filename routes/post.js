const express = require("express");
const router = express.Router();
const { authToken } = require("../utils/jwt");

const posts = [
  { username: "Abhay", title: "Post 1" },
  { username: "Michael", title: "Post 2" },
  { username: "Lilly", title: "Post 3" },
];

router.get("/", authToken, (req, res) => {
  res.json(posts.filter(({ username }) => username === req.user.name));
});

module.exports = router;
