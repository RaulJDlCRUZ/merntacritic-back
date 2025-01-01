import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import Fav from "../models/Fav.js";

var db = connection;

/* GET fav games listing from an user by user email. */
router.get("/:email", function (req, res) {
  find({ email: req.params.email })
    .sort("-addeddate")
    .populate("game")
    .exec(function (err, favs) {
      if (err) res.status(500).send(err);
      else res.status(200).json(favs);
    });
});

/* POST a new fav game */
router.post("/", function (req, res) {
  create(req.body, function (err, favinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* DELETE an existing fav game */
router.delete("/:id", function (req, res) {
  findByIdAndDelete(req.params.id, function (err, favinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

export default router;
