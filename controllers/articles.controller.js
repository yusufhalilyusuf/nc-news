const {
    fetchArticlesById,
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
  

  
  module.exports = {
    getArticlesById
  };