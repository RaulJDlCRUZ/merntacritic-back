import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
} from "../utils.js";
import { mohamedTarekRemoval } from "../columnas-eliminadas.js";
import { DateTime } from "luxon";

const mohamed_tarek_video_games = new mohamedTarekRemoval().filterlist;

const csvFilePath = "origin_csv/mohamed-games_description.csv";
const outFilePath = "filtered_csv/filtered_mohamed-games_description.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["name"] + "-" + element["release_date"].split(",")[1] + "-STEAM"
  );
}

/* Procesa el archivo CSV */
async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getFilteredHeaders(jsonArray, mohamed_tarek_video_games);
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
          let filteredValues = filterValues(element, mohamed_tarek_video_games);
          if (filteredValues.length > 0) {
            const record = createRecordObject(headers, filteredValues);
            // Estandarizar fecha
            record["release_date"] = DateTime.fromFormat(
              element["release_date"].trim(),
              "d MMM, yyyy"
            ).toFormat("yyyy-MM-dd");
            recordsMap.set(uniquekey, record);
          }
        }
      }
    });

    // Escribir todos los registros únicos en el archivo CSV
    await csvWriter.writeRecords(Array.from(recordsMap.values()));
    console.log(
      `[W] ${recordsMap.size} récords escritos correctamente en ${outFilePath}`
    );
  } catch (error) {
    console.error("Error en el procesado CSV:", error);
  }
}

// Llamar a función principal
processCSV();
