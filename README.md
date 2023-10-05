 # About Northcoders News API  
In this project, you can access a database and send requests to see relevant data. You can see all available endpoints and example responses in endpoints.json file or, in hosted version https://nc-news-pcfh.onrender.com/api  


# How to run locally  

- clone this repo  
$ git clone https://github.com/yusufhalilyusuf/nc-news  

-In order to connect to test and dev databases, you need to create environmental variables named 'PGDATABASE' with value of database name.Also they should be stored in '.env.test' and '.env.development' files.  

- Install dependencies  
$ npm install  

- Create local database and seed   
$ npm run setup-dbs  
$ npm seed  

- Run the app  
$ npm start  

- Running unit tests  
$ npm run test  

-All available endpoints  
https://localhost:9090/api   




