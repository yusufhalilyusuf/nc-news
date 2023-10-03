const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getAllEndpoints } = require("./controllers/api.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getAllEndpoints);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;
