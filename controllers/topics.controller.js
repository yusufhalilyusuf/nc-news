const { fetchTopics } = require("../models/topics.model");
function getTopics(req, res, next) {
  fetchTopics().then((result) => {
    res.status(200).send({topics:result});
  });
}

module.exports = {
  getTopics,
};
