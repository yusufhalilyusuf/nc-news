const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getAllEndpoints } = require("./controllers/api.controller");
const {
  getArticlesById,
  getArticles,
} = require("./controllers/articles.controller");
const { customErrorHandler } = require("./controllers/errors.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.use(customErrorHandler);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;
