// Para que funcione depende de ejecutarse, anteriormente el de unión
import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
  createRatingObject,
} from "../my_utils/utils.js";
import { nikdavisRemoval } from "../my_utils/columnas-eliminadas.js";

const nikdavis_video_games = new nikdavisRemoval().filterlist;
const csvFilePath = "filtered_csv/nikdavis-merge.csv";
const outFilePath = "filtered_csv/filtered_nikdavis.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["name"] +
    "-" +
    // released tiene formato YYYY-MM-DD, solo se necesita el año
    element["release_date"].split("-")[0] +
    "-" +
    element["developer"].split(";")[0]
  );
}

/* Función que obtiene el tipo de rating del juego */
function getRating(rating) {
  if (!rating) {
    // return "Pending";
    return { PEGI: "Pending" };
  }
  let attributes = rating.split(" ");
  // Trabajamos con PEGI al ser españa (Europa)
  if (attributes.length === 1) {
    return createRatingObject("PEGI", attributes[0]);
  }
  return createRatingObject("PEGI", attributes[1]);
}

/* Función que convierte una lista separada por ";" en un array JSON */
function JSONifycommaList(commaList) {
  if (!commaList) {
    return "[]";
  }
  return JSON.stringify(commaList.split(";"));
}

/* Función que elimina terminadores innecesarios en una celda que no es la última de una fila */
function removeUnnecessaryTerminators(text) {
  if (!text) {
    return text;
  }
  // Elimina terminadores innecesarios como espacios en blanco y saltos de línea
  return text.replace(/[\s\n\r]+$/, "");
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getFilteredHeaders(jsonArray, nikdavis_video_games);
    // console.log(headers);
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
          //   console.log(uniquekey);
          let filteredValues = filterValues(element, nikdavis_video_games);
          // Asegurarse de que filteredValues no esté vacío
          if (filteredValues.length > 0) {
            // Procesar valores separados por ";" (punto y coma)
            filteredValues[headers.indexOf("developer")] = JSONifycommaList(
              filteredValues[headers.indexOf("developer")]
            );
            filteredValues[headers.indexOf("categories")] = JSONifycommaList(
              filteredValues[headers.indexOf("categories")]
            );
            filteredValues[headers.indexOf("genres")] = JSONifycommaList(
              filteredValues[headers.indexOf("genres")]
            );
            filteredValues[headers.indexOf("steamspy_tags")] = JSONifycommaList(
              filteredValues[headers.indexOf("steamspy_tags")]
            );
            // Eliminar terminadores innecesarios
            filteredValues[headers.indexOf("short_description")] =
              removeUnnecessaryTerminators(
                filteredValues[headers.indexOf("short_description")]
              );
            filteredValues[headers.indexOf("detailed_description")] =
              removeUnnecessaryTerminators(
                filteredValues[headers.indexOf("detailed_description")]
              );
            filteredValues[headers.indexOf("about_the_game")] =
              removeUnnecessaryTerminators(
                filteredValues[headers.indexOf("about_the_game")]
              );
            // PEGI Rating
            filteredValues[headers.indexOf("required_age")] = JSON.stringify(
              getRating(filteredValues[headers.indexOf("required_age")])
            ).replace(/"/g, ""); // Elimina comillas dobles
            const record = createRecordObject(headers, filteredValues);
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

processCSV();
