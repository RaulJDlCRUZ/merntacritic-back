import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import GameAwards from "../models/GameAwards.js";

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

/* GET de los registros de premios de videojuegos */
router.get("/", function (req, res, next) {
  GameAwards.find()
    .sort({ year: -1 })
    .exec(function (err, awards) {
      if (err) res.status(500).send(err);
      else res.status(200).json(awards);
    });
});

/* GET datos de premios por su Id */
router.get("/id/:id", function (req, res, next) {
  GameAwards.findById(req.params.id, function (err, award) {
    if (err) res.status(500).send(err);
    else res.status(200).json(award);
  });
});

/* GET datos de premios por su juego */
router.get("/:game", function (req, res, next) {
  GameAwards.find({ game: req.params.game }, function (err, award) {
    if (err) res.status(500).send(err);
    else res.status(200).json(award);
  });
});

/* GET Buscador de GOTY de un juego dado (nombre) */
router.get("/goty/:game", function (req, res, next) {
  GameAwards.findOne({ game: req.params.game, category: "Game of the Year" }, function (err, award) {
    if (err) res.status(500).send(err);
    else res.status(200).json(award);
  });
});

export default router;
