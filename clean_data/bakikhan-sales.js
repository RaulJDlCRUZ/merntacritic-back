import {
  readCSVFile,
  createCSVWriter,
  createRatingObject,
} from "../my_utils/utils.js";

const csvFilePath = "origin_csv/bakikhan-video-game-sales.csv";
const outFilePath = "filtered_csv/filtered_bakikhan-video-game-sales.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["Name"] +
    "-" +
    element["Platform"] +
    "-" +
    element["Year_of_Release"]
  );
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

/* Obtiene los headers del archivo csv (filtrado no requerido) */
function getHeaders(jsonArray) {
  return Object.keys(jsonArray[0]);
}

/* Cuenta los ceros en los atributos pasados en obj */
function countZeros(obj) {
  return Object.values(obj).reduce((count, value) => {
    const num = parseFloat(value);
    return count + (num === 0 ? 1 : 0);
  }, 0);
}

/* Obtiene los atributos numéricos de una fila */
function getNumericAttributes(row, first, last) {
  return Object.fromEntries(Object.entries(row).slice(first, last + 1));
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getHeaders(jsonArray);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["Name"]) {
        console.log(`[!] L${index + 2} Juego sin nombre omitido`);
      } else if (/\(.*sales.*\)/i.test(element["Name"])) {
        // A veces se ponen a parte las ventas junto al juego (posibles duplicados!)
        console.log(
          `[!] L${index + 2} ${
            element["Name"]
          } contiene palabra "ventas", omitido`
        );
      } else {
        uniquekey = generateUniqueKey(element);
        // Arreglar Rating
        element["Rating"] = JSON.stringify(
          getRating(element["Rating"])
        ).replace(/"/g, ""); // Elimina comillas dobles

        if (recordsMap.has(uniquekey)) {
          console.log(`[!] L${index + 2} Duplicado: ${uniquekey}`);

          const originalRow = recordsMap.get(uniquekey);

          const originalRowSubset = getNumericAttributes(originalRow, 5, 13);
          const elementSubset = getNumericAttributes(element, 5, 13);

          const originalRowZeros = countZeros(originalRowSubset);
          const currentRowZeros = countZeros(elementSubset);

          if (currentRowZeros < originalRowZeros) {
            // Reemplazar el registro en el mapa si el nuevo tiene menos ceros = más fiable
            recordsMap.set(uniquekey, element);
            console.log("[!] Reemplazado con menos ceros:", index + 2);
          } else {
            console.log(
              "[!] Posible duplicado omitido por muchos valores nulos:",
              index + 2
            );
          }
        } else {
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
    console.error("Error en el procesado CSV:", error);
  }
}

processCSV();
