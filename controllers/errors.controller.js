function customErrorHandler(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
}
function psqlErrorHandler(err, req, res, next) {
  if (err.code) {
    if (err.code == 23503 && err.detail.includes("author")) {
      res.status(400).send({ message: "author doesn't exist" });
    } else if (err.code == 23503 && err.detail.includes("topic")) {
      res.status(400).send({ message: "topic doesn't exist" });
    } else if (err.code == 42601) {
      res.status(400).send({ message: "limit is wrong" });
    } else if (err.code == 42703) {
      res.status(400).send({ message: "page is wrong" });
    } else if (err.code === "22P02") {
      res.status(400).send({ message: "limit is wrong" });
    } else if (err.code === "23502") {
      res.status(400).send({ message: "slug is required" });
    } else console.log(err);
  }
}

module.exports = {
  customErrorHandler,
  psqlErrorHandler,
};
