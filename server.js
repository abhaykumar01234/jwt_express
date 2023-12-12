require("dotenv").config();
const express = require("express");
const app = express();
const postsRouter = require("./routes/post");
const {
  createAccessToken,
  createRefreshToken,
  authRefreshToken,
  deleteRefreshToken,
} = require("./utils/jwt");

app.use(express.json());
app.use("/posts", postsRouter);

app.post("/login", (req, res) => {
  // Authenticate User
  const name = req.body.username;
  const user = { name };
  return res.json({
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  });
});

app.post("/token", authRefreshToken, (req, res) => {
  const accessToken = createAccessToken({ name: req.user.name });
  return res.json({ accessToken });
});

app.delete("/logout", deleteRefreshToken, (req, res) => {
  return res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
