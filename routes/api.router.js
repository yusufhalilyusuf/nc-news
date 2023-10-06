const { getAllEndpoints } = require("../controllers/api.controller");
const { articlesRouter } = require("./articles.router");
const { commentsRouter } = require("./comments.router");
const { topicsRouter } = require("./topics.router");
const { usersRouter } = require("./users.router");

const apiRouter = require("express").Router();
apiRouter.get("", getAllEndpoints);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = {
  apiRouter,
};
