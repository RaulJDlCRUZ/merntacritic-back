import csv from "csv-parser";
import fs from "fs";
import { MongoClient } from "mongodb";
import GameAwards from "../models/GameAwards.js";
import { normalizeRow } from "../my_utils/merge-utils.js";
import { GameAwardsHeaders } from "../my_utils/merge-headers.js";

const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "merntacritic";
const COLLECTION_NAME = "awards";
const file = "/home/ubicuos/final_csv/filtered_game_awards_updated.csv";
const awardsColumnMap = new GameAwardsHeaders().columnMap;

async function main() {
  // Conexión a la base de datos
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa.");

    const db = client.db(DATABASE_NAME);
    const awardsCollection = db.collection(COLLECTION_NAME);

    const stream = fs.createReadStream(file).pipe(csv());
    for await (const row of stream) {
      const award = new GameAwards(normalizeRow(row, awardsColumnMap, false));
      const validationError = award.validateSync();
      if (validationError) {
        console.error("Error de validación:", validationError);
      } else {
        try {
          await awardsCollection.insertOne(award);
          console.log("Juego insertado:", award.game);
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

main();
