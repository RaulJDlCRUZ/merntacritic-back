import { readFileSync } from "fs";
import papa from "papaparse"; // Para leer CSV
import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { GameHeaders } from "../my_utils/merge-headers.js";

const input_files = [
  "filtered_csv/console/filtered_austin_corgis_video_games.csv",
  "filtered_csv/pc-steam/filtered_th_game_info.csv",
  "filtered_csv/pc-steam/filtered_mohamed-games_description.csv",
  // Agrega más rutas de CSV según sea necesario
];

const { parse } = papa;
const outputPath = "merge_data/games.csv";
const gameHeaders = new GameHeaders().headers;
const columnMap = new GameHeaders().columnMap;
const csvWriter = createObjectCsvWriter({
  path: outputPath,
  header: gameHeaders,
});

/* Busca en cada columna de un CSV un valor asociado al columnmap */
const normalizeRow = (row, columnMap) => {
  const normalizedRow = {};

  for (const [targetColumn, possibleColumns] of Object.entries(columnMap)) {
    for (const sourceColumn of possibleColumns) {
      if (row[sourceColumn.toLowerCase()] !== undefined) {
        normalizedRow[targetColumn] = row[sourceColumn.toLowerCase()];
        break; // Sal del bucle en cuanto encuentres un match
      }
    }
    // Si no se encuentra una columna en el CSV, establece un valor por defecto
    if (!normalizedRow[targetColumn]) {
      normalizedRow[targetColumn] = null;
    }
  }

  return normalizedRow;
};

/* Combina los datos de varios datasets en un solo array */
const mergeData = (datasets, columnMap) => {
  const mergedData = [];

  for (const dataset of datasets) {
    if (!Array.isArray(dataset)) {
      continue;
    }
    for (const row of dataset) {
      const normalized = normalizeRow(row, columnMap);
      mergedData.push(normalized);
    }
  }

  return mergedData;
};

/* Función para leer un CSV y devolver un array de objetos JSON */
const readCsv = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const { data } = parse(content, { header: true, skipEmptyLines: true });
  return data;
};

/* Eliminar duplicados en base a una clave única */
const removeDuplicates = (data) => {
  const seen = new Set();
  return data.filter((row) => {
    const uniqueKey = `${row.title}-${row.platform}-${row.release_date}-${row.developer}`;
    if (seen.has(uniqueKey)) {
      return false;
    }
    seen.add(uniqueKey);
    return true;
  });
};

// Función principal para combinar datos y generar el CSV
const generateGamesCsv = async () => {
  try {
    // Leer y procesar todos los datasets
    let combinedData = [];
    for (const file of input_files) {
      combinedData.push(readCsv(file));
    }
    console.log("[i] Datos combinados");
    // console.log(combinedData);

    // Normalizar y combinar datos
    let mergedData = mergeData(combinedData, columnMap);
    console.log("[i] Datos normalizados y combinados");

    // Eliminar duplicados
    mergedData = removeDuplicates(mergedData);
    console.log("[i] Duplicados eliminados");

    // console.log(mergedData);

    // Escritura del archivo CSV final
    await csvWriter.writeRecords(mergedData);
    console.log(
      `Archivo generado en: ${outputPath}. ${mergeData.length} registros escritos.`
    );
  } catch (err) {
    console.error("Error al generar el archivo:", err);
  }
};

// Ejecutar el script
generateGamesCsv();
