import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
} from "../utils.js";

import { DateTime } from "luxon";

const csvFilePath = "origin_csv/liam_Steam_games.csv";
const outFilePath = "filtered_csv/filtered_liam_steam_games.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return element["Name"] + "-" + element["rel_date"].split("-")[2];
}

/* Transforma la fecha de lanzamiento a formato ISO */
function transformReleaseDate(element) {
  // Formato original: MM-dd-yyyy
  const [month, day, year] = element["rel_date"].split("-");
  return DateTime.fromFormat(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    "yyyy-MM-dd"
  ).toISODate();
}

/* Principalmente esta función va a eliminar muchos duplicados detectados... */
async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = Object.keys(jsonArray[0]);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["Name"]) {
        console.log(`[!] Sin nombre L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
        } else {
          // Procesar fecha de lanzamiento (a formato ISO) y mapear
          if (element["rel_date"]) {
            element["rel_date"] = transformReleaseDate(element);
          }
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
    console.error(error);
  }
}

processCSV();
