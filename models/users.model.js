const db = require("../db/connection");

function fetchUsers() {
  return db.query("select * from users").then((users) => {
    return users.rows;
  });
}

function fetchUsersByName(username) {
  return fetchUsers().then((result) => {
    return result.filter((x) => {
      return x.username === username;
    });
  });
}

module.exports = {
  fetchUsers,
  fetchUsersByName,
};
