const { fetchArticlesById } = require("../models/articles.model");
const { fetchCommentsByArticleId } = require("../models/comments.model");
const { getArticlesById } = require("./articles.controller");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;

  fetchArticlesById(article_id)
  .then((rows)=>{
    return fetchCommentsByArticleId(article_id)
  }).then((result) => {
    console.log(result);
      res.status(200).send({ comments: result });
    }).catch((err) => {
      next(err);
    });
}

module.exports = {
  getCommentsByArticleId,
};