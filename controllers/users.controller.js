const { fetchUsers, fetchUsersByName } = require("../models/users.model");

function getUsers(req, res, next) {
  fetchUsers().then((result) => {
    res.status(200).send({ users: result });
  });
}

function getUsersByName(req, res, next) {
  const { username } = req.params;
  fetchUsersByName(username).then((result) => {
    if (result.length === 0) {
      return next({ status: 404, message: "user not found" });
    }
    res.status(200).send({ user: result });
  }).catch(next)
}

module.exports = {
  getUsers,
  getUsersByName,
};
