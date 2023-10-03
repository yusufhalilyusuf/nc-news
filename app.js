const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getAllEndpoints } = require("./controllers/api.controller");
const { getArticlesById } = require("./controllers/articles.controller");
const { customErrorHandler } = require("./controllers/errors.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticlesById);


app.use(customErrorHandler);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;
