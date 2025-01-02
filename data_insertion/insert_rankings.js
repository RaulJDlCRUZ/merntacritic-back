import csv from "csv-parser";
import fs from "fs";
import { MongoClient } from "mongodb";
import Ranking from "../models/Ranking.js";
import { normalizeRow } from "../my_utils/merge-utils.js";
import { RankingHeaders } from "../my_utils/merge-headers.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

const MONGO_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_NAME;
const COLLECTION_NAME = "rankings";
const file = "/home/ubicuos/final_csv/rankings.csv";
const rankingsColumnMap = new RankingHeaders().alternateColumnMap;

async function main() {
  // Conexión a la base de datos
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa.");

    const db = client.db(DATABASE_NAME);
    const rankingCollection = db.collection(COLLECTION_NAME);

    const stream = fs.createReadStream(file).pipe(csv());
    for await (const row of stream) {
      const ranking = new Ranking(normalizeRow(row, rankingsColumnMap, false));
      const validationError = ranking.validateSync();
      if (validationError) {
        console.error("Error de validación:", validationError);
      } else {
        try {
          await rankingCollection.insertOne(ranking);
          console.log("Juego insertado:", ranking.game);
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
