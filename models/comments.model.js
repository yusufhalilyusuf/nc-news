const db = require("../db/connection");

function fetchCommentsByArticleId(article_id) {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const queryString = `SELECT * FROM comments WHERE article_id=$1 order by created_at desc`;
  return db.query(queryString, [article_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    } else {
      return result.rows;
    }
  });
}
module.exports = {
  fetchCommentsByArticleId,
};