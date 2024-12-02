import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  createRecordObject,
} from "../my_utils/utils.js";

const csvFilePath = "origin_csv/dahlia-metacritic_game_info.csv";
const outFilePath = "filtered_csv/filtered_dahlia-metacritic_game_info.csv";

let uniquekey = "";

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return element["Title"] + "-" + element["Platform"] + "-" + element["Year"];
}

/* Valores separados por , o ; son transformados a listas JSON */
function JSONifycommaList(element) {
  if (element.includes(",")) {
    return JSON.stringify(element.split(",").map((item) => item.trim()));
  } else if (element.includes(";")) {
    return JSON.stringify(element.split(";").map((item) => item.trim()));
  } else {
    return element;
  }
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    // const headers = Object.keys(jsonArray[0]).slice(1);
    const headers = Object.keys(jsonArray[0])
      .slice(1)
      .map((header) =>
        header === "No_Players" ? "FeaturesNumPlayers" : header
      );
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["Title"]) {
        console.log(`[!] Sin título L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
        } else if (
          ["no genre", "tbd", "undefined", "not specified"].some((str) =>
            uniquekey.toLowerCase().includes(str)
          )
        ) {
          console.log(`[!] Registro malo L${index + 2}`);
        } else {
          let filteredValues = filterValues(element, [0]);
          //Procesar Publisher	y Genre, valores separados por , o ;
          if (filteredValues.length > 0) {
            filteredValues[headers.indexOf("Publisher")] = JSONifycommaList(
              filteredValues[headers.indexOf("Publisher")]
            );
            filteredValues[headers.indexOf("Genre")] = JSONifycommaList(
              filteredValues[headers.indexOf("Genre")]
            );
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
    console.error(error);
  }
}

processCSV();
