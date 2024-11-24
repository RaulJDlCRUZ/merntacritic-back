import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
} from "../utils.js";

import { DateTime } from "luxon";

const csvFilePath = "origin_csv/masood-video_games.csv";
const outFilePath = "filtered_csv/filtered_masood_vidgames.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["name"] +
    "-" +
    element["platform"].trim() +
    "-" +
    element["release_date"].split(",")[1].trim()
  );
}

/* Estandariza la fecha a formato ISO */
function standardizeDate(date) {
  // Month DD, YYYY
  return DateTime.fromFormat(date.trim(), "MMMM d, yyyy").toISODate();
}

function sanitizeUserReview(review) {
  // Si no es un número entre 0.0 y 10.0, se elimina el valor
  const reviewValue = parseFloat(review);
  if (reviewValue >= 0.0 && reviewValue <= 10.0) {
    return reviewValue;
  } else {
    return "";
  }
}

/* Procesa el archivo CSV */
async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = Object.keys(jsonArray[0]);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["name"]) {
        console.log(`[!] Sin nombre L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
        } else {
          // Estandarizar fecha
          element["release_date"] = standardizeDate(element["release_date"]);
          // Sanitizar Puntuación de usuario
          element["user_review"] = sanitizeUserReview(element["user_review"]);
          // Quitar algún espacio en blanco
          element["platform"] = element["platform"].trim();
          recordsMap.set(uniquekey, element);
        }
      }
    });

    // Escribir todos los registros únicos en el archivo CSV
    await csvWriter.writeRecords(Array.from(recordsMap.values()));
    console.log(
      `[W] ${recordsMap.size} récords escritos correctamente en ${outFilePath}`
    );
  } catch (error) {
    console.error(`[!] Error: ${error.message}`);
  }
}

processCSV();
