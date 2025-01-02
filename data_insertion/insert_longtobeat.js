import csv from "csv-parser";
import fs from "fs";
import { MongoClient } from "mongodb";
import LongToBeat from "../models/LongToBeat.js";
import { normalizeRow } from "../my_utils/merge-utils.js";
import { LongToBeatHeaders } from "../my_utils/merge-headers.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

const MONGO_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_NAME;
const COLLECTION_NAME = "longtobeat";
const file = "/home/ubicuos/final_csv/longtobeat_cleaned.csv";
const ltbColumnMap = new LongToBeatHeaders().alternateColumnMap;

async function main() {
  // Conexión a la base de datos
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa.");

    const db = client.db(DATABASE_NAME);
    const ltbCollection = db.collection(COLLECTION_NAME);

    const stream = fs.createReadStream(file).pipe(csv());
    for await (const row of stream) {
      const ltb = new LongToBeat(normalizeRow(row, ltbColumnMap, false));
      const validationError = ltb.validateSync();
      if (validationError) {
        console.error("Error de validación:", validationError);
      } else {
        try {
          await ltbCollection.insertOne(ltb);
          console.log("Juego insertado:", ltb.game);
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
