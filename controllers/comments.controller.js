const { fetchArticlesById } = require("../models/articles.model");
const {
  fetchCommentsByArticleId,
  insertComment,
  deleteCommentFromDb,
  patchCommentInDb,
} = require("../models/comments.model");
const { getArticlesById } = require("./articles.controller");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  const {limit,page} = req.query;
  fetchArticlesById(article_id)
    .then((rows) => {
      return fetchCommentsByArticleId(article_id,limit,page);
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
      res.status(201).send( result );
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  deleteCommentFromDb(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
}

function patchCommentbyCommentId(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (Object.keys(req.body).length != 1) {
    return next({ status: 400, message: "inc_votes required only" });
  }
  patchCommentInDb(comment_id, inc_votes)
    .then((result) => {
      res.status(200).send({ comment: result });
    })
    .catch(next);
}

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteComment,
  patchCommentbyCommentId,
};
