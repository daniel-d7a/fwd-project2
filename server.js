const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("website"));

const port = 5500;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

let projectData = {};

app.get("/getLatestEntry", (req, res) => {
  console.log(projectData);
  res.send(projectData);
});

const postResponse = {
  msg: "data saved successfully!",
};

app.post("/postEntry", (req, res) => {
  projectData = req.body;
  res.send(postResponse);
});
