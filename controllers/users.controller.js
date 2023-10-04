const { fetchUsers } = require("../models/users.model")

function getUsers(req,res,next){
    fetchUsers().then((result)=>{
        
        res.status(200).send({users: result})
    })
}

module.exports = {
    getUsers
}