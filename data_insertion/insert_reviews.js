import csv from "csv-parser";
import fs from "fs";
import { MongoClient } from "mongodb";
import Review from "../models/Review.js";
import { normalizeRow } from "../my_utils/merge-utils.js";
import { ReviewHeaders } from "../my_utils/merge-headers.js";
import dotenv from "dotenv";
dotenv.config({ override: true });

const MONGO_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_NAME;
const COLLECTION_NAME = "reviews";
const file = "/home/ubicuos/final_csv/reviews.csv";
const reviewsColumnMap = new ReviewHeaders().alternateColumnMap;

function convertFracToNum(frac) {
  if (String(frac).indexOf("/") !== -1) {
    const [num, den] = frac.split("/");
    return Number(10 * (parseFloat(num) / parseFloat(den)));
  } else {
    return Number(frac);
  }
}

async function main() {
  // Conexión a la base de datos
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa.");

    const db = client.db(DATABASE_NAME);
    const reviewsCollection = db.collection(COLLECTION_NAME);

    const stream = fs.createReadStream(file).pipe(csv());
    for await (const row of stream) {
      const normalizedRow = normalizeRow(row, reviewsColumnMap, false);
      normalizedRow.review_score = convertFracToNum(normalizedRow.review_score);
      const review = new Review(normalizedRow);
      const validationError = review.validateSync();
      if (validationError) {
        console.error("Error de validación:", validationError);
      } else {
        try {
          await reviewsCollection.insertOne(review);
          console.log("Juego insertado:", review.game);
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