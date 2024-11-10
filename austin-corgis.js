import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
} from "./utils.js";
import { austinCorgisRemoval } from "./columnas-eliminadas.js";

const austin_corgis_video_games = new austinCorgisRemoval().filterlist;

const csvFilePath = "origin_csv/austin-corgis-video_games.csv";
const outFilePath = "filtered_csv/filtered_austin_corgis_video_games.csv";
const uniqueList = [];

let uniquekey = "";

/* Limpia los headers de caracteres especiales */
function sanitizeHeaders(headers) {
  return headers.map((element) =>
    element
      .replace(/\./g, "-")
      .replace(/\s+/g, "")
      .replace(/\+/g, "")
      .replace(/\?/g, "")
  );
}

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["Title"] +
    "-" +
    element["Release.Console"] +
    "-" +
    element["Release.Year"]
  );
}

function processMetadataGenres(genre) {
  // Eliminar comillas dobles al principio y al final
  if (genre.startsWith('"') && genre.endsWith('"')) {
    genre = genre.slice(1, -1);
  }

  // Reemplazar valores separados por comas y generar lista JSON
  if (genre.includes(",")) {
    genre = JSON.stringify(genre.split(",").map((item) => item.trim()));
  }

  return genre;
}

/* Procesa el archivo CSV */
async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getFilteredHeaders(jsonArray, austin_corgis_video_games);
    const newHeaders = sanitizeHeaders(headers);
    const csvWriter = createCSVWriter(outFilePath, newHeaders);
    const recordsToWrite = [];

    jsonArray.forEach((element) => {
      if (!element["Title"]) {
        console.log(`[!] Sin nombre L${index + 2}\n`);
        console.log(element);
      } else {
        uniquekey = generateUniqueKey(element);

        if (uniqueList.includes(uniquekey)) {
          console.log("[!] " + uniquekey);
        } else {
          uniqueList.push(uniquekey);
          let filteredValues = filterValues(element, austin_corgis_video_games);

          // Comprobar si existe el campo "Genres" y procesarlo
          if (filteredValues[3]) {
            filteredValues[3] = processMetadataGenres(filteredValues[3]);
          }
          const newObject = createRecordObject(newHeaders, filteredValues);
          recordsToWrite.push(newObject);
        }
      }
    });

    await csvWriter.writeRecords(recordsToWrite);
    console.log(
      `[W] ${recordsToWrite.length} récords escritos correctamente en ${outFilePath}`
    );
  } catch (error) {
    console.error("Error en el procesado CSV:", error);
  }
}

// Llamada a la función principal
processCSV();
