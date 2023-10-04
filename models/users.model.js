const db = require("../db/connection");

function fetchUsers() {
  return db.query("select * from users").then((users) => {
    return users.rows;
  });
}

module.exports = {
  fetchUsers,
};
