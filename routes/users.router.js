const { getUsers, getUsersById, getUsersByName } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.get('/:username',getUsersByName)

module.exports = {
  usersRouter
};
