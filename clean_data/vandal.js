import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
  createRatingObject,
} from "../utils.js";

import { DateTime } from "luxon";

const csvFilePath = "origin_csv/vandal.csv";
const outFilePath = "filtered_csv/filtered_vandal.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["game"] +
    "-" +
    element["platform"] +
    "-" +
    // Obtengo EL AÑO (último elemento de la cadena) dividiendo por un espacio o barra (regex)
    element["release"].split(/[/ ]/).pop()
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

/* Función que obtiene una fecha completa en formato ISO*/
function transformReleaseDate(element) {
  const release = element["release"];
  const monthsInSpanish = {
    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12",
  };

  if (release.toLowerCase().split(" ")[0] === "año") {
    // Formato: Año YYYY
    return Number(release.split(" ")[1]);
  }

  let dateParts = release.split(/[/ ]/);

  if (dateParts.length === 3) {
    // Formato completo: DD/MM/YYYY
    let [day, month, year] = dateParts;
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");
    const isoDate = DateTime.fromFormat(
      `${day}-${month}-${year}`,
      "dd-MM-yyyy"
    ).toISODate();
    return isoDate;
  } else if (dateParts.length === 2) {
    // Formato incompleto: Month YYYY
    const [month, year] = dateParts;
    const isoDate = DateTime.fromFormat(
      `01-${monthsInSpanish[month.toLowerCase()]}-${year}`,
      "dd-MM-yyyy"
    ).toISODate();
    return isoDate;
  } else {
    // Formato desconocido
    return null;
  }
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getFilteredHeaders(jsonArray, [0]);
    // console.log(headers);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["game"]) {
        console.log(`[!] Sin juego L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
        } else {
          let filteredValues = filterValues(element, [0]);
          if (filteredValues.length > 0) {
            filteredValues[headers.indexOf("release")] =
              transformReleaseDate(element);
            filteredValues[headers.indexOf("classification")] = JSON.stringify(
              getRating(filteredValues[headers.indexOf("classification")])
            ).replace(/"/g, ""); // Elimina comillas dobles
            recordsMap.set(
              uniquekey,
              createRecordObject(headers, filteredValues)
            );
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
