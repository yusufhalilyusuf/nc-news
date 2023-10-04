const db = require("../db/connection");

function fetchCommentsByArticleId(article_id) {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const queryString = `SELECT * FROM comments WHERE article_id=$1 order by created_at desc`;
  return db.query(queryString, [article_id]).then((result) => {
    return result.rows;
  });
}

function insertComment(body, commentToBeInserted, article_id, username) {
  if (!username || !article_id || Object.keys(body).length != 2) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  return db
    .query("select username from users")
    .then((result) => {
      const validUsernames = result.rows.map((x) => x.username);
      if (!validUsernames.includes(username)) {
        return Promise.reject({ status: 404, message: "not found" });
      }
    })
    .then(() => {
      return db.query(
        `select author from articles where article_id = ${article_id}`
      );
    })
    .then((result) => {
      const author = result.rows[0].author;
      const queryString = `insert into comments (article_id, body, author)
    values($1, $2, $3 )returning *;`;
      return db.query(queryString, [article_id, commentToBeInserted, author]);
    })
    .then((res) => {
      return res.rows[0].body;
    });
}
module.exports = {
  fetchCommentsByArticleId,
  insertComment,
};
