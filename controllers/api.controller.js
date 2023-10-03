const { fetchAllEndpoints } = require("../models/api.model");
function getAllEndpoints(req, res, next) {
  fetchAllEndpoints().then((result) => {
    res.status(200).send({ Available_Endpoints: result });
  });
}

module.exports = {
  getAllEndpoints,
};
