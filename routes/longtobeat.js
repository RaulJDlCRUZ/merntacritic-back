import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import LongToBeat from "../models/LongToBeat.js";

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

/* GET de un listado de ventas normal */
router.get("/", function (req, res) {
  LongToBeat.find()
    .limit(100)
    .exec(function (err, ltbs) {
      if (err) res.status(500).send(err);
      else res.status(200).json(ltbs);
    });
});

/* GET datos de ventas por su Id */
router.get("/id/:id", function (req, res, next) {
  LongToBeat.findById(req.params.id, function (err, ltb) {
    if (err) res.status(500).send(err);
    else res.status(200).json(ltb);
  });
});

/* GET datos de ventas por su juego */
router.get("/:game", function (req, res, next) {
  LongToBeat.findOne({ game: req.params.game }, function (err, ltb) {
    if (err) res.status(500).send(err);
    else res.status(200).json(ltb);
  });
});

export default router;
