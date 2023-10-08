const db = require("../db/connection");

function fetchTopics() {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

function insertTopics(slug,description){
  const query = `insert into topics (slug,description) values($1, $2) returning *`
  return db.query(query,[slug,description]).then((result)=>{
    console.log(result.rows[0]);
    if(result.rows[0].description===null){
      
      return Promise.reject({status:400 ,message:'description is required'})
    }
    return result.rows
  })
}

module.exports = {
  fetchTopics,
  insertTopics
};
