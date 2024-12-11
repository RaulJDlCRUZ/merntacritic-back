import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { GameHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  removeDuplicates,
  readCsv,
  mergeDuplicates,
  generateSlug,
  generateSlugComplex,
  findDuplicateSlugs,
  normalizePlatform,
} from "../my_utils/merge-utils.js";

const outputPath = "merge_data/games.csv";
const gameHeaders = new GameHeaders().headers;
const columnMap = new GameHeaders().columnMap;
const csvWriter = createObjectCsvWriter({
  path: outputPath,
  header: gameHeaders,
});

const input_files = [
  "filtered_csv/console/filtered_austin_corgis_video_games.csv",
  "filtered_csv/pc-steam/filtered_th_game_info.csv",
  "filtered_csv/pc-steam/filtered_mohamed-games_description.csv",
  "filtered_csv/pc-steam/filtered_nikdavis.csv",
  "filtered_csv/pc-steam/filtered_mk-tm-merged_data.csv",
  "filtered_csv/pc-steam/filtered_liam_steam_games.csv",
  "filtered_csv/pc-steam/filtered_masood_vidgames.csv",
  "filtered_csv/both/filtered_jvc.csv",
  "filtered_csv/both/filtered_vandal.csv",
  "filtered_csv/both/filtered_dahlia-metacritic_game_info.csv",
  "filtered_csv/both/filtered_bakikhan-video-game-sales.csv",
  // Agrega más rutas de CSV según sea necesario
];

const isPcSteam = input_files.some((file) => file.includes("/pc-steam/"));

// Función principal para combinar datos y generar el CSV
const generateGamesCsv = async () => {
  try {
    let mergedData = [];
    for (const file of input_files) {
      // Leer CSV
      const data = readCsv(file);
      console.log(`[i] Datos leídos de ${file}`);
      // Normalizar y combinar datos
      const normalizedData = data.map((row) =>
        normalizeRow(row, columnMap, isPcSteam)
      );
      console.log(`[i] Datos normalizados de ${file}`);

      // Homogeneizar platform
      normalizedData.forEach((row) => {
        if (row.platform && !row.platform.includes("[") && row.platform !== "PC" && row.platform !== "Web") {
          // process.stdout.write(row.platform + " -> ");
          row.platform = normalizePlatform(row.platform);
          // process.stdout.write(row.platform + "\n");
        }
      });

      // Generar slug si no existe
      normalizedData.forEach((row) => {
        if (!row.slug && row.title) {
          row.slug = generateSlug(row.title);
        }
      });
      // Añadir datos normalizados al conjunto de datos combinados
      mergedData = mergedData.concat(normalizedData);
      console.log(`[i] Datos combinados de ${file}`);
    }

    // Filtrar filas que son completamente nulas
    mergedData = mergedData.filter((row) =>
      Object.values(row).some((value) => value !== null)
    );
    // Elimina las filas con la información más esencial faltante
    mergedData = mergedData.filter(
      (row) => row.title && row.platform && row.release_date
    );
    console.log("[i] Registros nulos eliminados");

    // Eliminar slugs duplicados
    const duplicateSlugs = findDuplicateSlugs(mergedData);

    if (duplicateSlugs.size > 0) {
      console.log(`[i] ${duplicateSlugs.size} slugs duplicados.`);
      mergedData.forEach((row) => {
        if (duplicateSlugs.has(row.slug)) {
          row.slug = generateSlugComplex(
            row.title,
            row.platform,
            row.release_date
          );
        }
      });
    }
    
    // console.log(`[i] -> ${findDuplicateSlugs(mergedData).size} registros`);
    mergedData = mergeDuplicates(mergedData);
    console.log("[i] Duplicados combinados");

    // Revisamos si aún quedan duplicados
    mergedData = removeDuplicates(mergedData);
    console.log("[i] Duplicados eliminados");

    // Escritura del archivo CSV final
    await csvWriter.writeRecords(mergedData);
    console.log(
      `Archivo generado en: ${outputPath}. ${mergedData.length} registros escritos.`
    );
  } catch (err) {
    console.error("Error al generar el archivo:", err);
  }
};

// Ejecutar el script
generateGamesCsv();
