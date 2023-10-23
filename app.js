const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getAllEndpoints } = require("./controllers/api.controller");
const {
  getArticlesById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controller");
const { customErrorHandler, psqlErrorHandler } = require("./controllers/errors.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const { apiRouter } = require("./routes/api.router");
const { topicsRouter } = require("./routes/topics.router");
const { usersRouter } = require("./routes/users.router");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
// app.get("/api", getAllEndpoints);
// app.get("/api/topics", getTopics);
// app.get("/api/users", getUsers);
// app.get("/api/articles/:article_id", getArticlesById);
// app.get("/api/articles", getArticles);
// app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
// app.post("/api/articles/:article_id/comments", postCommentByArticleId);
// app.patch("/api/articles/:article_id", patchArticle);
// app.delete("/api/comments/:comment_id", deleteComment);


app.use(customErrorHandler);
app.use(psqlErrorHandler)

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "path not found" });
});
// app.listen(9090, () => {
//     console.log("listening on port 9090...");
//   });

module.exports = app;
