const {
  fetchArticlesById,
  fetchArticles,
  patchArticleinDb,
  insertArticle
} = require("../models/articles.model");
const { fetchTopics } = require("../models/topics.model");

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
  const { topic, sort_by, order } = req.query;
  fetchArticles(topic,sort_by,order)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch(next);
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

function postArticle(req,res,next){
  const {author,title,topic,body,article_img_url} = req.body
  if(Object.keys(req.body).length!=5){
    return next({status:400, message:'remove unnecessary properties'})
  }
  insertArticle(author,title,topic,body,article_img_url).then((result)=>{
    res.status(201).send({article: result})
  }).catch(err=>{
    next(err)
  })
}

module.exports = {
  getArticlesById,
  getArticles,
  patchArticle,
  postArticle
};
