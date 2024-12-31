import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import Sales from "../models/Sales.js";

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

/* GET de un listado de ventas normal */
router.get("/", function (req, res, next) {
  Sales.find()
    .sort({global_sales : -1})
    // .limit(10)
    .exec(function (err, sales) {
      if (err) res.status(500).send(err);
      else res.status(200).json(sales);
    });
});

/* GET datos de ventas por su Id */
router.get("/id/:id", function (req, res, next) {
  Sales.findById(req.params.id, function (err, sale) {
    if (err) res.status(500).send(err);
    else res.status(200).json(sale);
  });
});

/* GET datos de ventas por su juego */
router.get("/:game", function (req, res, next) {
  Sales.findOne({ game: req.params.game }, function (err, sale) {
    if (err) res.status(500).send(err);
    else res.status(200).json(sale);
  });
});

export default router;
