import csv from "csv-parser";
import fs from "fs";
import { MongoClient } from "mongodb";
import Game from "../models/Game.js";
import { normalizeRow, readCsv } from "../my_utils/merge-utils.js";
import { GameHeaders } from "../my_utils/merge-headers.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

const MONGO_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_NAME;
const COLLECTION_NAME = "games";
const file = "/home/ubicuos/final_csv/games.csv";
const gamesColumnMap = new GameHeaders().alternateColumnMap;

async function main() {
  // Conexión a la base de datos
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa.");

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const stream = fs.createReadStream(file).pipe(csv());
    for await (const row of stream) {
      const game = new Game(normalizeRow(row, gamesColumnMap, false));
      const validationError = game.validateSync();
      if (validationError) {
        console.error("Error de validación:", validationError);
      } else {
        try {
          await collection.insertOne(game);
          console.log("Juego insertado:", game.slug);
        } catch (error) {
          console.error("Error al insertar el juego:", error);
        }
      }
    }
    await client.close();
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    return;
  }
}

async function testRead() {
  const data = readCsv(file);
  data.forEach((row) => {
    const game = new Game(normalizeRow(row, gamesColumnMap, false));
    const validationError = game.validateSync();
    if (validationError) {
      console.error("Error de validación:", validationError);
      // } else {
      //   console.log("Fila válida:", game.slug);
      // }
    }
  });
}

// testRead();
main();
