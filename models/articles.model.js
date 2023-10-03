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


module.exports = {
  fetchArticlesById,
};