import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import Game from "../models/Game.js";

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

/* GET de un listado de juegos normal */
router.get("/", function (req, res, next) {
  Game.find()
    .limit(50) // SI NO QUITO EL LIMITE: JAVASCRIPT HEAP OUT OF MEMORY
    // .sort("-creationdate")
    .sort({ metascore: -1 })
    .exec(function (err, games) {
      if (err) res.status(500).send(err);
      else res.status(200).json(games);
    });
});

/* GET de un juego su Id */
router.get("/id/:id", function (req, res, next) {
  Game.findById(req.params.id, function (err, game) {
    if (err) res.status(500).send(err);
    else res.status(200).json(game);
  });
});

/* GET de un juego su slug */
router.get("/:slug", function (req, res, next) {
  Game.findOne({ slug: req.params.slug }, function (err, game) {
    if (err) res.status(500).send(err);
    else res.status(200).json(game);
  });
});

/* GET de un juego (o juegos) por un nombre */
router.get("/search/:name", function (req, res, next) {
  /* Expresión regular ya que en la búsqueda no se distingue entre mayúsculas y minúsculas */
  Game.find(
    { title: { $regex: new RegExp(req.params.name, "i") } },
    function (err, games) {
      if (err) res.status(500).send(err);
      else res.status(200).json(games);
    }
  );
});

export default router;
