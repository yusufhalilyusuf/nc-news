const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");

function fetchCommentsByArticleId(article_id, limit = 10, page = "") {
  const arrayToPass = [];
  let queryString = `SELECT * FROM comments WHERE article_id=$1 order by created_at desc limit $2`;

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  } else {
    arrayToPass.push(article_id);
    arrayToPass.push(limit);
    if (page) {
      arrayToPass.push(page);
      queryString += ` offset ($3-1)*$2`;
    }
    return db.query(queryString, arrayToPass).then((result) => {
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
      return {comment:res.rows[0].body, id: res.rows[0].comment_id};
    });
}

function deleteCommentFromDb(comment_id) {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      message: "bad request, comment id should be a number",
    });
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
function patchCommentInDb(comment_id, inc_votes) {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      message: "comment id should be a number",
    });
  }
  if (typeof inc_votes === "string") {
    return Promise.reject({
      status: 400,
      message: "inc_votes should be a number",
    });
  }

  const query = `select * from comments where comment_id=$1`;
  return db
    .query(query, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "comment id not found" });
      }
    })
    .then(() => {
      const currentVote = 100;
      const query = `update comments set votes=(select votes from comments where comment_id=${comment_id}) + ${inc_votes} where comment_id=${comment_id} returning *`;
      // const query1 = `update comments set votes=(select votes from comments where comment_id=$1) + $2} where comment_id=$3 returning *`

      return db.query(query);
    })
    .then((result) => {
      return result.rows;
    });
}

module.exports = {
  fetchCommentsByArticleId,
  insertComment,
  deleteCommentFromDb,
  patchCommentInDb,
};
