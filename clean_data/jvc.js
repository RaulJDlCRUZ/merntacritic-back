import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
  createRatingObject,
} from "../my_utils/utils.js";
import { DateTime } from "luxon";
import { jvcRemoval } from "../my_utils/columnas-eliminadas.js";

const jvc_games = new jvcRemoval().filterlist;
const csvFilePath = "origin_csv/jvc.csv";
const outFilePath = "filtered_csv/filtered_jvc.csv";
const noDate = "Date de sortie inconnue";
let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  if (element["release"] !== noDate) {
    return (
      element["game_en"] +
      "-" +
      element["platform"] +
      "-" +
      // Obtengo EL AÑO (último elemento de la cadena) dividiendo por un espacio o barra (regex)
      element["release"].split(/[/ ]/).pop()
    );
  } else {
    return element["game_en"] + "-" + element["platform"];
  }
}

/* Función que obtiene el tipo de rating del juego */
function getRating(rating) {
  if (!rating || rating === "Unknown") {
    // return "Pending";
    return { PEGI: "Pending" };
  }
  let attributes = rating.split(" ");
  // Trabajamos con PEGI al ser francia (Europa)
  return createRatingObject("PEGI", attributes[0]);
}

/* Función que obtiene una fecha completa en formato ISO*/
function transformReleaseDate(element) {
  const release = element["release"];
  const monthsInFrench = {
    janvier: "01",
    février: "02",
    mars: "03",
    avril: "04",
    mai: "05",
    juin: "06",
    juillet: "07",
    août: "08",
    septembre: "09",
    octobre: "10",
    novembre: "11",
    décembre: "12",
  };

  if (release === noDate) {
    return "None";
  }
  const date = release.split(" ");
  if (date.length === 1) {
    return Number(release);
  } else if (date.length === 2) {
    // Formato incompleto: Month YYYY
    const [month, year] = date;
    const isoDate = DateTime.fromFormat(
      `01-${monthsInFrench[month.toLowerCase()]}-${year}`,
      "dd-MM-yyyy"
    ).toISODate();
    return isoDate;
  } else if (date.length === 3) {
    // Formato completo: dd Month YYYY
    let [day, month, year] = date;
    day = day.padStart(2, "0");
    month = monthsInFrench[month.toLowerCase()];
    const isoDate = DateTime.fromFormat(
      `${day}-${month}-${year}`,
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
    const headers = getFilteredHeaders(jsonArray, jvc_games);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["game_en"]) {
        console.log(`[!] L${index + 2} Juego sin nombre omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (!recordsMap.has(uniquekey)) {
          let filteredValues = filterValues(element, jvc_games);
          if (filteredValues.length > 0) {
            // transformar campo de fecha a formato ISO
            filteredValues[headers.indexOf("release")] =
              transformReleaseDate(element);
            // transformar campo de rating a objeto
            filteredValues[headers.indexOf("classification")] = JSON.stringify(
              getRating(filteredValues[headers.indexOf("classification")])
            ).replace(/"/g, ""); // Elimina comillas dobles
            recordsMap.set(
              uniquekey,
              createRecordObject(headers, filteredValues)
            );
          }
        } else {
          console.log(`[!] L${index + 2} Juego duplicado omitido`);
          //   console.log(uniquekey);
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
