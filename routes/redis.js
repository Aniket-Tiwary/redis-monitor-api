const express = require("express");
const router = express.Router();
const MD5 = require("md5");
const redis = require("redis");

// requiring the RedisInfo model
const RedisInfo = require("../models/RedisInfo");

// this route lists all the stored redisDBs
router.get("/redis_list", async (req, res) => {
  let foundHosts = await RedisInfo.findAll();
  res.status(200).json(foundHosts);
});

// this route gives the information about a particular redis DB like host,port,password,etc.
router.get("/redis_info", async (req, res) => {
  let foundHost = await RedisInfo.findOne({ where: { md5: req.query.md5 } });
  if (foundHost) {
    res.status(200).json(foundHost);
  } else {
    res.status(404).json({ msg: "host not found!" });
  }
});

// this route returns all the redisDB related inforamtion for a particular redis instance like version,os,key,etc.
router.get("/redis_montior", async (req, res) => {
  try {
    let foundHost = await RedisInfo.findOne({ where: { md5: req.query.md5 } });
    if (foundHost) {
      let config = {
        host: foundHost.host,
        port: parseInt(foundHost.port),
      };

      if (foundHost.password) {
        config.password = foundHost.password;
      }
      const client = redis.createClient(config);
      client.info((err, res) => {
        res.status(200).json(client.server_info);
      });
    } else {
      res.status(404).json({ msg: "Host not found!" });
    }
  } catch {
    res.status(404).json({ msg: "get redis realtime information error !" });
  }
});

// this route checks whether the provided redis instance is valid
router.get("/ping", async (req, res) => {
  const { host, port, password } = req.query;
  let config = {
    host,
    port: parseInt(port),
    retry_strategy: function (options) {
      if (options.error && options.error.code === "ECONNREFUSED") {
        return new Error("The server refused the connection");
      }
    },
  };

  if (password) {
    config.password = password;
  }

  try {
    const client = redis.createClient(config);
    res.status(200).json({ msg: "Ping success!" });
  } catch (e) {
    res.status(400).json({ msg: "Ping error!" });
  }
});

// this route add a valid unique redis instance to the sqlite DB
router.post("/add", async (req, res) => {
  const { host, port, password } = req.body;
  let pingStatus = "OK";

  try {
    //ping the host
    let config = {
      host,
      port: parseInt(port),
      retry_strategy: function (options) {
        if (options.error && options.error.code === "ECONNREFUSED") {
          // return new Error("The server refused the connection");
          pingStatus = "NOT_OK";
        }
      },
    };

    if (password) {
      config.password = password;
    }

    const client = redis.createClient(config);
    if (pingStatus === "NOT_OK") {
      res.status(400).json({ msg: "Ping error!" });
    } else if (pingStatus === "OK") {
      //save to db when ping success
      let newHost = await RedisInfo.create({
        md5: MD5(`${host}${port}`),
        host,
        port,
        password,
      });

      res.status(201).json(newHost);
    }
  } catch (e) {
    // ping error
    res.status(400).json({ msg: "Ping error!" });
    return;
  }
});

// this route deletes a particular redis instance from sqlite DB
router.delete("/del", async (req, res) => {
  let foundHost = await RedisInfo.findOne({ where: { md5: req.query.md5 } });
  if (foundHost) {
    await foundHost.destroy();
    res.status(200).json({ msg: "deleted host successfully" });
  } else {
    res.status(404).json({ msg: "Host not found!" });
  }
});

// flushdb will flush keys from selected redis DB
router.delete("/redis/flushall", async (req, res) => {
  const { md5, db = 0 } = req.query;
  let foundHost = await RedisInfo.findOne({ where: { md5 } });
  let config = {
    host: foundHost.host,
    port: parseInt(foundHost.port),
    db: parseInt(db),
  };

  if (foundHost.password) {
    config.password = foundHost.password;
  }

  // flusdb of redis
  let client = redis.createClient(config);

  client.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
    res.status(202).json({ msg: "Redis DB Flushed successfull!!" });
  });
});

// exports the routes
module.exports = router;
