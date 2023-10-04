const {
  fetchArticlesById,
  fetchArticles,
  patchArticleinDb,
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

function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) {
    return next({ status: 400, message: "bad request, inc_votes required" });
  } else if (Object.keys(req.body).length != 1) {
    return next({
      status: 400,
      message: "bad request, inc_votes required only",
    });
  } else if (typeof inc_votes != "number") {
    return next({
      status: 400,
      message: "bad request, inc_votes should be a number",
    });
  }

  fetchArticlesById(article_id)
    .then((rows) => {
      return patchArticleinDb(article_id, inc_votes);
    })
    .then((result) => {
      res.status(200).send({ updated_article: result });
    })
    .catch(next);
}

module.exports = {
  getArticlesById,
  getArticles,
  patchArticle,
};
