import { readCSVFile, createCSVWriter } from "./utils.js";

const csvFilePath = "origin_csv/bakikhan-video-game-sales.csv";
const outFilePath = "filtered_csv/1_filtered_bakikhan-video-game-sales.csv";

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
        console.log(`[!] Sin nombre L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);

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
