const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");

function fetchCommentsByArticleId(article_id) {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  } else {
    const queryString = `SELECT * FROM comments WHERE article_id=$1 order by created_at desc`;
    return db.query(queryString, [article_id]).then((result) => {
      return result.rows;
    });
  }
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

function deleteCommentFromDb(comment_id) {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  } else {
    return db
      .query(`select comment_id from comments`)
      .then((comment_ids) => {
        const currentComments = comment_ids.rows.map((x) => x.comment_id);
        if (!currentComments.includes(+comment_id)) {
          return Promise.reject({
            status: 404,
            message: "comment id not found",
          });
        }
      })
      .then(() => {
        const queryString = `delete from comments where comment_id=$1`;
        return db.query(queryString, [comment_id]);
      });
  }
}
module.exports = {
  fetchCommentsByArticleId,
  insertComment,
  deleteCommentFromDb,
};
