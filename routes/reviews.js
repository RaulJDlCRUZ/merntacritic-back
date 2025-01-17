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

function tokenVerify(req, res, next) {
  var authHeader = req.get("authorization");
  if (!authHeader) {
    return res.status(401).send({
      ok: false,
      message: "Token inválido",
    });
  }

  const retrievedToken = authHeader.split(" ")[1];
  if (!retrievedToken) {
    return res.status(401).send({
      ok: false,
      message: "Token inválido",
    });
  }

  jwt.verify(retrievedToken, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({
        ok: false,
        message: "Token inválido",
      });
    } else {
      req.user = decoded;
      next();
    }
  });
}

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: 1 })
      .exec();

    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
    });
  } catch (error) {
    debugInstance(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET últimas reseñas de juegos */
router.get("/latest", async (req, res) => {
  debugInstance("GET /reviews/latest");
  try {
    const reviews = await Review.find({ date: { $lte: new Date() } })
      .sort({ date: -1 })
      .limit(5)
      .exec();

    res.status(200).json(reviews);
  } catch (error) {
    debugInstance(error);
    res.status(500).json({ message: "Server error" });
  }
});

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

router.post("/", function (req, res) {
  const review = req.body;
  if (!review.game) {
    return res.status(400).json({ message: "Game parameter is required" });
  }

  Game.findOne({ slug: review.game.slug })
    .exec()
    .then((gameDoc) => {
      if (!gameDoc) {
        throw new Error("Game not found");
      }

      const newReview = new Review({
        game: review.game,
        username: review.username,
        review_text: review.review_text,
        review_score: review.review_score,
        review_votes: review.review_votes,
        hours_played: review.hours_played,
        recommendation: review.recommendation,
        date: review.date || new Date(),
      });

      return newReview.save();
    })
    .then((newReview) => {
      res.status(201).json(newReview);
    })
    .catch((err) => {
      if (err.message === "Game not found") {
        res.status(404).json({ message: err.message });
      } else {
        debugInstance(err);
        res.status(500).json({ message: "Server error" });
      }
    });
});

/* POST de reseñas SECURIZADO, SIMPLIFICADO Y USANDO PROMESAS */
router.post("/secure", tokenVerify, function (req, res) {
  debugInstance("POST /reviews/secure", req.body);
  Review.create(req.body).then(function (review) {
    res.status(201).json(review);
  }).catch(function (err) {
    res.status(500).send(err);
  });
});

export default router;
