const db = require("../db/connection");

function fetchArticlesById(article_id) {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const queryString = `SELECT * FROM articles WHERE article_id=$1`;
  return db.query(queryString, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    } else {
      return result.rows;
    }
  });
}

function fetchArticles(sort_by = "created_at", order = "desc") {
    const queryString = `SELECT articles.author, title, article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id ORDER by ${sort_by} ${order}`;
    return db.query(queryString).then((result) => {
      return result.rows;
    });
  }


module.exports = {
  fetchArticlesById,
  fetchArticles
};