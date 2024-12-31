import { Router } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

//Models
import User from "../models/User.js";

function tokenVerify(req, res, next) {
  var authHeader = req.get("authorization");
  const retrievedToken = authHeader && authHeader.split(" ")[1];

  if (!retrievedToken) {
    res.status(401).send({
      ok: false,
      message: "Token inválido",
    });
  } else {
    jwt.verify(
      retrievedToken,
      process.env.TOKEN_SECRET,
      function (err, retrievedToken) {
        if (err) {
          res.status(401).send({
            ok: false,
            message: "Token inválido",
          });
        } else {
          next();
        }
      }
    );
  }
}

/* GET de un listado de usuarios normal */
router.get("/", function (req, res, next) {
  User.find()
    .sort("-creationdate")
    .exec(function (err, users) {
      if (err) res.status(500).send(err);
      else res.status(200).json(users);
    });
});

/* GET de un listado de usuarios seguro con token */
router.get("/secure", tokenVerify, function (req, res, next) {
  debug("Acceso seguro con token a los usuarios");
  User.find()
    .sort("-creationdate")
    .exec(function (err, users) {
      if (err) res.status(500).send(err);
      else res.status(200).json(users);
    });
});

/* GET de un único usuario por su Id */
router.get("/:id", function (req, res, next) {
  User.findById(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

/* GET de un único usuario por su Id - SECURE */
router.get("/secure/:id", tokenVerify, function (req, res, next) {
  debug("Acceso seguro con token a un usuario");
  User.findById(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

/* POST de un nuevo usuario */
router.post("/", function (req, res, next) {
  User.create(req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* POST de un nuevo usuario - SECURE */
router.post("/secure", tokenVerify, function (req, res, next) {
  debug("Creación de un usuario segura con token");
  User.create(req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* POST (modificación) de un usuario existente identificado por su Id - SECURE */
router.put("/secure/:id", tokenVerify, function (req, res, next) {
  debug("Modificación segura de un usuario con token");
  User.findByIdAndUpdate(req.params.id, req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* DELETE de un usuario existente identificado por su Id */
router.delete("/:id", function (req, res, next) {
  User.findByIdAndDelete(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* DELETE de un usuario existente identificado por su Id - SECURE */
router.delete("/secure/:id", tokenVerify, function (req, res, next) {
  debug("Borrado seguro de un usuario con token");
  User.findByIdAndDelete(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

export default router;
