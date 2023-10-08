const {
  getArticles,
  getArticlesById,
  patchArticle,
  postArticle,
  deleteArticle
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.post('/',postArticle)
articlesRouter.delete('/:article_id',deleteArticle)

module.exports = {
  articlesRouter,
};
