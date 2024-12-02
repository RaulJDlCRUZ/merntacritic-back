import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
  createRatingObject,
} from "../my_utils/utils.js";
import { trungHoangRemoval } from "../my_utils/columnas-eliminadas.js";

const trung_hoang_video_games = new trungHoangRemoval().filterlist;
const csvFilePath = "origin_csv/th_game_info.csv";
const outFilePath = "filtered_csv/filtered_th_game_info.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["slug"] +
    "-" +
    // released tiene formato YYYY-MM-DD, solo se necesita el año
    element["released"].split("-")[0]
  );
}

/* Valores separados por || son transformados a listas JSON */
function JSONifycommaList(element) {
  if (element.includes("||")) {
    return JSON.stringify(element.split("||").map((item) => item.trim()));
  } else {
    return element;
  }
}

/* Función que obtiene el tipo de rating del juego */
function getRating(rating) {
  if (!rating) {
    return { ESRB: "Pending" };
  }
  let attributes = rating.split(" ");
  // Trabajamos con ESRB
  if (attributes.length === 1) {
    return createRatingObject("ESRB", attributes[0]);
  }
  return createRatingObject("ESRB", attributes[1]);
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getFilteredHeaders(jsonArray, trung_hoang_video_games);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["slug"]) {
        console.log(`[!] Sin slug L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
        } else {
          // Procesar valores separados por ||
          let filteredValues = filterValues(element, trung_hoang_video_games);
          // Asegurarse de que filteredValues no esté vacío
          if (filteredValues.length > 0) {            
            // Elementos 10 al 13 son valores separados por || (plataformas, desarrolladores, generos, publicadores)
            for (let i = 10; i < 14; i++) {
              if (filteredValues[i]) {
                filteredValues[i] = JSONifycommaList(filteredValues[i]);
              }
            }
            if (filteredValues[headers.indexOf("esrb_rating")]) {
              filteredValues[headers.indexOf("esrb_rating")] = JSON.stringify(
                getRating(filteredValues[headers.indexOf("esrb_rating")])
              ).replace(/"/g, ""); // Elimina comillas dobles
            }
          }
          const newObject = createRecordObject(headers, filteredValues);
          recordsMap.set(uniquekey, newObject);
          //   console.log(`[i] L${index + 2} procesado: ${uniquekey}`);
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

// Llamada a la función principal
processCSV();
