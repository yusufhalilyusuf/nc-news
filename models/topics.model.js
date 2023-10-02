const db = require("../db/connection");

function fetchTopics() {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

module.exports = {
  fetchTopics,
};
