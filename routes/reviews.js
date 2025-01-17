import { Router } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:reviews");

import Game from "../models/Game.js";
import Review from "../models/Review.js";


const pageSize = 50;

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

function tokenVerify (req, res, next) {
  var authHeader=req.get('authorization');
  const retrievedToken = authHeader.split(' ')[1];
  
  if (!retrievedToken) {
      res.status(401).send({
          ok: false,
          message: "Token inválido"
      })
  }else{       
      jwt.verify(retrievedToken, process.env.TOKEN_SECRET,  function (err, retrievedToken) {
          if (err) {
              res.status(401).send({
                  ok: false,
                  message: "Token inválido"
              });
          } else {
              next();
          }
      });
  }
}

/* GET de reseñas de un slug dado. */
router.get("/:slug", async (req, res) => {
  debugInstance("GET /reviews/:slug", req.params);
  try {
    const { slug } = req.params;
    const { page = 1 } = req.query;
    const game = await Game.findOne({ slug });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const reviews = await Review.find({ game: game.slug })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json(reviews);
  } catch (error) {
    debugInstance(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      game,
      username,
      review_text,
      review_score,
      review_votes,
      hours_played,
      recommendation,
      date,
    } = req.body;

    if (!game) {
      return res.status(400).json({ message: "Game parameter is required" });
    }

    const gameDoc = await Game.findOne({ slug: game });
    if (!gameDoc) {
      return res.status(404).json({ message: "Game not found" });
    }

    const newReview = new Review({
      game: gameDoc._id,
      username,
      review_text,
      review_score,
      review_votes,
      hours_played,
      recommendation,
      date: date || new Date(),
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    debugInstance(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/secure", tokenVerify, async (req, res) => {
  try {
    const {
      game,
      username,
      review_text,
      review_score,
      review_votes,
      hours_played,
      recommendation,
      date,
    } = req.body;

    if (!game) {
      return res.status(400).json({ message: "Game parameter is required" });
    }

    const gameDoc = await Game.findOne({ slug: game });
    if (!gameDoc) {
      return res.status(404).json({ message: "Game not found" });
    }

    const newReview = new Review({
      game: gameDoc._id,
      username,
      review_text,
      review_score,
      review_votes,
      hours_played,
      recommendation,
      date: date || new Date(),
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    debugInstance(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;