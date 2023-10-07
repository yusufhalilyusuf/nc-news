function customErrorHandler(err, req, res, next) {
    if (err.status) {
      
      res.status(err.status).send({ message: err.message });
    } else {
      next(err);
    }
  }
  function psqlErrorHandler (err,req,res,next){
    if(err.code){
    if(err.code==23503&&err.detail.includes('author')){
      
      res.status(400).send({message:"author doesn't exist"})
    }else if(err.code==23503&&err.detail.includes('topic')){
      res.status(400).send({message:"topic doesn't exist"})
    }else console.log(err);
    }
   
}
  
  module.exports = {
    customErrorHandler,
    psqlErrorHandler
  };