const fs = require('fs.promises')

function fetchAllEndpoints (){
     return fs.readFile(__dirname+`/../endpoints.json`,'utf-8')
     .then((result)=>{
        const parsedObject = JSON.parse(result)
        delete parsedObject['GET /api']
        // console.log(parsedObject);
        return parsedObject
     })
}

module.exports = {
    fetchAllEndpoints
}