const { fetchArticlesById } = require("../models/articles.model");
const {
  fetchCommentsByArticleId,
  insertComment,
} = require("../models/comments.model");
const { getArticlesById } = require("./articles.controller");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;

  fetchArticlesById(article_id)
    .then((rows) => {
      return fetchCommentsByArticleId(article_id);
    })
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { body, username } = req.body;

  fetchArticlesById(article_id)
    .then(() => {
      return insertComment(req.body, body, article_id, username);
    })
    .then((result) => {
      res.status(201).send({ comment: result });
    })
    .catch(next);
}

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
};
