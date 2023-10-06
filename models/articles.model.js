const db = require("../db/connection");
const { fetchTopics } = require("./topics.model");

function fetchArticlesById(article_id) {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const queryString = `SELECT articles.article_id, title, topic, articles.author,articles.body, articles.created_at, articles.votes, article_img_url, count(comments.body)::int as comment_count FROM articles left join comments using (article_id) group by (article_id) having article_id=$1`;
  return db.query(queryString, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    } else {
      return result.rows;
    }
  });
}

function fetchArticles(topic = "", sort_by = "created_at", order = "desc") {
  const existingTopics = [];
  const allowedOrders = ["asc", "desc"];

  let stringQuery = `SELECT articles.author, title, article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id`;
  return fetchTopics()
    .then((topics) => {
      topics.forEach((topic) => {
        existingTopics.push(topic.slug);
      });
      if (topic) {
        if (existingTopics.includes(topic)) {
          stringQuery += ` HAVING topic='${topic}'`;
        } else
          return Promise.reject({
            status: 404,
            message: "not found, topic doesn't exist",
          });
      }
    })
    .then(() => {
      return getArticleColumns();
    })
    .then((allowedSorts) => {
      if (!allowedSorts.includes(sort_by)) {
        return Promise.reject({
          status: 400,
          message: "bad request, invalid sort parameter",
        });
      } else if (!allowedOrders.includes(order)) {
        return Promise.reject({
          status: 400,
          message: "bad request, invalid order parameter",
        });
      }
      stringQuery += ` ORDER by ${sort_by} ${order}`;
    })
    .then(() => {
      return db.query(stringQuery);
    })
    .then((result) => {
      return result.rows;
    });
}

function patchArticleinDb(article_id, vote) {
  const currentVote = 100;
  const queryString = `update articles set votes= ${
    currentVote + vote
  } where article_id = $1 returning * ;`;
  return db.query(queryString, [article_id]).then((result) => {
    return result.rows;
  });
}

module.exports = {
  fetchArticlesById,
  fetchArticles,
  patchArticleinDb,
};

function getArticleColumns() {
  const allowedSorts = [];
  return db
    .query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='articles'`
    )
    .then((result) => {
      result.rows.forEach((x) => {
        allowedSorts.push(x.column_name);
      });
      return allowedSorts;
    });
}
