import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  getFilteredHeaders,
  createRecordObject,
} from "../my_utils/utils.js";
import { DateTime } from "luxon";

const csvFilePath = "origin_csv/merged_data.csv";
const outFilePath = "filtered_csv/filtered_mk-tm-merged_data.csv";

let uniquekey = "";

/* Valores separados por | son transformados a objetos JSON */
function processComputerRequirements(my_requirements) {
  const requirements = my_requirements.split("|").map((item) => item.trim());
  const result = [];
  for (let i = 0; i < requirements.length; i += 2) {
    if (i === 0 && requirements[i].toLowerCase().includes("64-bit processor")) {
      result.push(requirements[i]);
      i--; // No tiene valor, porque es una advertencia, así que se resta 1 para que no se pierda la siguiente clave
    } else {
      const key = requirements[i];
      const value = requirements[i + 1] || "";
      if (key && value) {
        result.push(`'${key} ${value}'`);
      }
    }
  }
  return result.join(", "); // Para que sea un objeto JSON válido
}

/* Genera una clave única (tipo slug) para cada elemento */
function generateUniqueKey(element) {
  return (
    element["Title"] + "-" + element["Release Date"].split(",")[1] + "-STEAM"
  );
}

/* Estandariza la fecha a formato ISO */
function standardizeDate(date) {
  // Valores vacíos o desconocidos los limpiamos
  if (!date) {
    return "";
  } else if (date.toLowerCase().includes("soon", "to be announced")) {
    return "";
  } else if (date.trim().length === 4) {
    // Si date es un número de 4 dígitos, se asume que es el año y se devuelve intacto
    return date;
  } else if (/^Q[1-4] \d{4}$/.test(date.trim())) {
    // Si date es un trimestre de un año (Qn YYYY), se devuelve el año (simplificado para ISO)
    return date.split(" ")[1];
  } else {
    // DD MMM, YYYY
    return DateTime.fromFormat(date.trim(), "d MMM, yyyy").toISODate();
  }
}

/* Procesa el archivo CSV */
async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    const headers = getFilteredHeaders(jsonArray, [8, 9]);
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      if (!element["Title"]) {
        console.log(`[!] Sin nombre L${index + 2}, omitido`);
      } else {
        uniquekey = generateUniqueKey(element);
        if (recordsMap.has(uniquekey)) {
          console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
        } else {
          let filteredValues = filterValues(element, [8, 9]);
          if (filteredValues.length > 0) {
            const record = createRecordObject(headers, filteredValues);
            // Cambiar palabra free de precio a 0
            record["Original Price"] =
              record["Original Price"].toLowerCase() === "free"
                ? "0"
                : record["Original Price"];
            record["Discounted Price"] =
              record["Discounted Price"].toLowerCase() === "free"
                ? "0"
                : record["Discounted Price"];
            // Estandarizar fecha
            record["Release Date"] = standardizeDate(element["Release Date"]);
            // Procesar requerimientos de computadora
            record["Minimum Requirements"] = JSON.stringify(
              processComputerRequirements(element["Minimum Requirements"])
            ).replace(/"/g, ""); // Elimina comillas dobles
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
