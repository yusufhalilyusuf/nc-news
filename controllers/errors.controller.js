function customErrorHandler(err, req, res, next) {
    if (err) {
      res.status(err.status).send({ message: err.message });
    } else {
      next(err);
    }
  }
  
  module.exports = {
    customErrorHandler,
  };