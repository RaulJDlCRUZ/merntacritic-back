import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import Ranking from "../models/Ranking.js";

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

/* GET de los registros de rankings de videojuegos */
router.get("/", function (req, res, next) {
  Ranking.find()
    .sort({ year: -1, rank: 1 })
    .exec(function (err, rankings) {
      if (err) res.status(500).send(err);
      else res.status(200).json(rankings);
    });
});

/* GET datos de rankings por su Id */
router.get("/id/:id", function (req, res, next) {
  Ranking.findById(req.params.id, function (err, ranking) {
    if (err) res.status(500).send(err);
    else res.status(200).json(ranking);
  });
});

/* GET datos de rankings por su juego */
router.get("/:game", function (req, res, next) {
  Ranking.findOne({ game: req.params.game }, function (err, ranking) {
    if (err) res.status(500).send(err);
    else res.status(200).json(ranking);
  });
});

export default router;
