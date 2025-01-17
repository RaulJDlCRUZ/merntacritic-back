import { Router } from "express";
// import jwt from "jsonwebtoken";
import mongoose from "mongoose";
var router = Router();

import debug from "debug";
const debugInstance = debug("merntacritic-back:games");

import Game from "../models/Game.js";
import Review from "../models/Review.js";
import GameAwards from "../models/GameAwards.js";

const pageSize = 50;

// DB Config
mongoose.set("strictQuery", false);
var db = mongoose.connection;

/* Función auxiliar que obtiene detalles de un juego */
async function getGameDetails(game) {
  // Obtener reseñas del juego, las más recientes primero, y sólo, p.e, 5
  const reviews = await Review.find({ game: game.slug })
    .sort({ date: -1 })
    .limit(5);

  // Obtener premios del juego
  const awards = await GameAwards.find({
    game: game.title,
  }).select("-__v");

  // Calcular estadísticas de reseñas
  const reviewStats = await Review.aggregate([
    { $match: { game: game.title } },
    {
      $group: {
        _id: null,
        averageScore: { $avg: "$review_score" },
        totalReviews: { $sum: 1 },
        totalHoursPlayed: { $sum: "$hours_played" },
        recommendationCount: {
          $sum: {
            $cond: [{ $eq: ["$recommendation", "Recommended"] }, 1, 0],
          },
        },
      },
    },
  ]);

  // Organizar premios por año y categoría
  const organizedAwards = awards.reduce((acc, award) => {
    if (!acc[award.year]) {
      acc[award.year] = [];
    }
    acc[award.year].push({
      category: award.category,
      winner: award.winner,
    });
    return acc;
  }, {});

  // Construir respuesta final
  const response = {
    gameDetails: {
      ...game.toObject(),
      reviews: {
        recent: reviews,
        stats: reviewStats[0] || {
          averageScore: 0,
          totalReviews: 0,
          totalHoursPlayed: 0,
          recommendationCount: 0,
        },
      },
      awards: organizedAwards,
    },
  };

  return response;
}

/* GET de un listado de juegos normal */
router.get("/", function (req, res, next) {
  debugInstance("GET /games");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || pageSize;
  const skip = (page - 1) * limit;

  Game.find()
    .skip(skip)
    .limit(limit)
    .exec(function (err, games) {
      if (err) res.status(500).send(err);
      else res.status(200).json(games);
    });
});

/* GET con filtros o PARÁMETROS */
router.get("/search", async (req, res) => {
  debugInstance("GET /games/search" + JSON.stringify(req.query));
  try {
    const filter = {};
    const queryKeys = Object.keys(req.query);
    queryKeys.forEach((key) => {
      if (req.query[key]) {
        if (key === "title") {
          filter[key] = { $regex: new RegExp(req.query[key], "i") };
        } else {
          filter[key] = req.query[key];
        }
      }
    });

    const games = await Game.find(filter).exec();
    res.status(200).json(games);
  } catch (error) {
    console.error("Error en la búsqueda de juegos:", error);
    res.status(500).json({
      message: "Error al buscar juegos",
      error: error.message,
    });
  }
});

/* GET de un listado de los MEJORES juegos (normal) */
router.get("/best", function (req, res, next) {
  debugInstance("GET /games/best");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  Game.find()
    .skip(skip)
    .limit(limit)
    .sort({ metascore: -1 })
    .exec(function (err, games) {
      if (err) res.status(500).send(err);
      else res.status(200).json(games);
    });
});

/* GET últimos lanzamientos de juegos */
router.get("/latest", function (req, res, next) {
  debugInstance("GET /games/latest");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  Game.find({ release_date: { $lte: new Date() } }) // Fecha de lanzamiento menor o igual a la actual
    .skip(skip)
    .limit(limit)
    .sort({ release_date: -1 })
    .exec(function (err, games) {
      if (err) res.status(500).send(err);
      else res.status(200).json(games);
    });
});

/* GET de un juego su slug */
router.get("/:slug", async (req, res) => {
  debugInstance("GET /games/" + req.params.slug);
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado (slug)" });
    }
    const response = await getGameDetails(game);
    res.json(response);
  } catch (error) {
    console.error("Error al obtener detalles del juego:", error);
    res.status(500).json({
      message: "Error al obtener detalles del juego",
      error: error.message,
    });
  }
});

/* GET de un juego su Id */
router.get("/id/:id", async function (req, res, next) {
  debugInstance("GET /games/id/" + req.params.id);
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }
    const response = await getGameDetails(game);
    res.json(response);
  } catch (error) {
    console.error("Error al obtener detalles del juego:", error);
    res.status(500).json({
      message: "Error al obtener detalles del juego",
      error: error.message,
    });
  }
});

export default router;
