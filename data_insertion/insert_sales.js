import csv from "csv-parser";
import fs from "fs";
import { MongoClient } from "mongodb";
import Sales from "../models/Sales.js";
import { normalizeRow } from "../my_utils/merge-utils.js";
import { SalesHeaders } from "../my_utils/merge-headers.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

const MONGO_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_NAME;
const COLLECTION_NAME = "sales";
const file = "/home/ubicuos/final_csv/sales_unique.csv";
const salesColumnMap = new SalesHeaders().alternateColumnMap;

async function main() {
  // Conexión a la base de datos
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa.");

    const db = client.db(DATABASE_NAME);
    const salesCollection = db.collection(COLLECTION_NAME);

    const stream = fs.createReadStream(file).pipe(csv());
    for await (const row of stream) {
      const sale = new Sales(normalizeRow(row, salesColumnMap, false));
      const validationError = sale.validateSync();
      if (validationError) {
        console.error("Error de validación:", validationError);
      } else {
        try {
          await salesCollection.insertOne(sale);
          console.log("Juego insertado:", sale.game);
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