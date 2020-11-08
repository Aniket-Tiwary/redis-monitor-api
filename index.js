// requiring express framework
const express = require("express");
const app = express();
// requiring the sqlite DB
const db = require("./config/database");
// requiring the cors package for handling the cors errors
const cors = require("cors");

// Connecting and syncing the sqlite DB respectively
db.authenticate()
  .then(() => {
    console.log("database connected");
    return db.sync({ force: true });
  })
  .then(() => {
    console.log("synced database");
  })
  .catch((err) => {
    console.log(err);
  });

// intializing the port
const PORT = process.env.PORT || 8080;
app.use(cors());

// parsing the body of the post request in json
app.use(express.json());

// requiring routes
const redisRoutes = require("./routes/redis");

app.get("/", (req, res) => {
  res.json({ msg: "OK" });
});

//  regisitering the redis routes
app.use("/api", redisRoutes);

// listening to the node server on the provide port
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
