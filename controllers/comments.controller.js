const { fetchCommentsByArticleId } = require("../models/comments.model");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getCommentsByArticleId,
};