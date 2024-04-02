const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

const memberTournamentPayoutData = require("./memberTournamentPayoutData.js");
const syndGroupingsData = require("./syndGroupingsData.js");
const syndScorecardData = require("./syndScorecardData.js");
const popTimechartData = require("./popTimechartData.js");


dotenv.config();
app.use(cors());

// allow cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/auth", (req, res) => {
  // verify with a basic token
  let basicToken = req.headers?.authorization?.split(" ")[1];
  console.log(
    basicToken,
    process.env.BASIC_TOKEN,
    basicToken !== process.env.BASIC_TOKEN
  );
  if (!basicToken || basicToken !== process.env.BASIC_TOKEN)
    res.status(401).json({
      message: "Unauthorized",
    });
  let data = {
    name: "Saravana Raja",
    email: "saravanaraja@demo.com",
  };
  const token = jsonwebtoken.sign(data, process.env.JWT_SECRET);
  res
    .json({
      access_token: token,
    })
    .status(200);
});

function authMiddleware(req, res, next) {
  let token = req.headers?.authorization?.split(" ")[1];
  console.log(req.headers);
  if (!token)
    res.status(401).json({
      message: "Unauthorized",
    });
  try {
    let data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
}

app.get("/memberspayout", authMiddleware, (req, res) => {
  res.json(memberTournamentPayoutData).status(200);
});

app.get("/syndGrouping", authMiddleware, (req, res) => {
  res.json(syndGroupingsData).status(200);
});

app.get("/syndScorecard", authMiddleware, (req, res) => {
  res.json(syndScorecardData).status(200);
});

app.get("/popTimechart", authMiddleware, (req, res) => {
  res.json(popTimechartData).status(200);
});

// run the server
app.listen(4000, () => {
  console.log("server started");
});
