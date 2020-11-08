# Redis Monitor Node API - Kritikal Campus Codeathon 1.0

A redis monitor API built using node js and sqlite3 DB

## Run Locally

To run the node server locally, go to any directory, open terminal and run the following commands:

```bash
$ git clone https://github.com/Aniket-Tiwary/redis-monitor-api.git
$ cd redis-monitor-api
$ npm install
$ npm start
```

Your app should be up and running on `localhost:8080`

## Tech Stack

### API

The API for this app is built with **Node.js**. Its a light-weight server built using Express framework and handles CRUD operations of the redis instances and the API returns the information of the redis DBs like version,os,keys,etc.

### Database

The popular SQL DB **sqlite** is used with **Sequelize** ORM for interacting with the DB. The database contains only one model namely **RedisInfo** which contains columns like MD5,host,port,password and add_time.


![RedisInfo model](https://github.com/Aniket-Tiwary/redis-monitor-api/blob/master/imgs/schema.png)

![Directory Structure](https://github.com/Aniket-Tiwary/redis-monitor-api/blob/master/imgs/file_dicectory.png)
