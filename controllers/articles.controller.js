const {
  fetchArticlesById,
  fetchArticles,
} = require("../models/articles.model");

function getArticlesById(req, res, next) {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
}
function getArticles(req, res, next) {
  fetchArticles().then((result) => {
    res.status(200).send({ articles: result });
  });
}

module.exports = {
  getArticlesById,
  getArticles,
};
