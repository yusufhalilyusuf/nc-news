const { fetchTopics,insertTopics } = require("../models/topics.model");
function getTopics(req, res, next) {
  fetchTopics().then((result) => {
    res.status(200).send({topics:result});
  });
}

function postTopics(req,res,next){
const {slug,description} = req.body;
if(Object.keys(req.body).length!=2){
  return next({status:400, message:'remove unnecesary properties'})
}

insertTopics(slug,description).then((result)=>{
  console.log(result.description);
  // if(result.description===undefined){
  //   return next({status:400, message: 'description is required'})
  // }
  res.status(200).send({topic: result})
}).catch(next)
}

module.exports = {
  getTopics,
  postTopics
};
