import { readFileSync } from "fs";
import papa from "papaparse"; // Para leer CSV
import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { GameHeaders } from "../my_utils/merge-headers.js";
import { DateTime } from "luxon";

const { parse } = papa;
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
  "filtered_csv/both/filtered_jvc.csv",
  "filtered_csv/both/filtered_vandal.csv",
  "filtered_csv/both/filtered_dahlia-metacritic_game_info.csv",
  "origin_csv/mohamed-games_ranking.csv",
  // Agrega más rutas de CSV según sea necesario
];

const isPcSteam = input_files.some(file => file.includes("/pc-steam/"));

/* Busca en cada columna de un CSV un valor asociado al columnmap */
const normalizeRow = (row, columnMap) => {
  const normalizedRow = {};

  for (const [targetColumn, possibleColumns] of Object.entries(columnMap)) {
    for (const sourceColumn of possibleColumns) {
      if (row[sourceColumn] !== undefined) {
        normalizedRow[targetColumn] = row[sourceColumn];
        break; // Sal del bucle en cuanto encuentres un match
      }
    }
    // Si no se encuentra una columna en el CSV, establece un valor por defecto
    if (!normalizedRow[targetColumn]) {
      normalizedRow[targetColumn] = null;
    }
  }

  // Si isPcSteam es verdadero y no existe platform, asignar "PC"
  if (isPcSteam && !normalizedRow.platform) {
    normalizedRow.platform = "PC";
  }

  return normalizedRow;
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
    const uniqueKey = `${row.title}-${row.platform}-${row.release_date}`;
    if (seen.has(uniqueKey)) {
      return false;
    }
    seen.add(uniqueKey);
    return true;
  });
};

/* Función para combinar datos duplicados basándose en la longitud de ciertos campos */
const mergeDuplicates = (data) => {
  const mergedData = [];
  const seen = new Map();

  data.forEach((row) => {
    const uniqueKey = `${row.title}-${row.platform}-${row.release_date}`;
    if (seen.has(uniqueKey)) {
      const existingRow = seen.get(uniqueKey);
      // Comparar y actualizar campos basados en la longitud de la cadena
      ["release_date", "description", "genre"].forEach((field) => {
        if (
          row[field] &&
          (!existingRow[field] || row[field].length > existingRow[field].length)
        ) {
          existingRow[field] = row[field];
        }
      });
    } else {
      seen.set(uniqueKey, row);
    }
  });

  seen.forEach((value) => mergedData.push(value));
  return mergedData;
};

/* Función para generar un slug a partir del nombre de un juego */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD") // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y símbolos por guiones
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio y al final
};

/* Función para generar un slug más complejo, con la plataforma si es consola, o año */
const generateSlugComplex = (name, platform, releaseDate) => {
  // Obtener slug base
  let slug = generateSlug(name);
  // Ahora miro si es una consola, y lo incluyo en el slug
  const excludedPlatforms = ["pc", "steam", "macos", "linux"];
  if (platform && !excludedPlatforms.includes(platform.toLowerCase())) {
    slug += `-${generateSlug(platform)}`;
    return slug;
  }
  // Si no, para duplicados incluyo el año
  if (releaseDate) {
    const year = DateTime.fromISO(releaseDate).year;
    slug += `-${year}`;
    return slug;
  }
};

/* Función para encontrar slugs duplicados */
const findDuplicateSlugs = (data) => {
  const slugs = new Set();
  const duplicates = new Set();

  for (const row of data) {
    if (slugs.has(row.slug)) {
      duplicates.add(row.slug);
    }
    slugs.add(row.slug);
  }

  return duplicates;
};

// Función principal para combinar datos y generar el CSV
const generateGamesCsv = async () => {
  try {
    let mergedData = [];
    for (const file of input_files) {
      // Leer CSV
      const data = readCsv(file);
      console.log(`[i] Datos leídos de ${file}`);
      // console.log(data);
      // Normalizar y combinar datos
      const normalizedData = data.map((row) => normalizeRow(row, columnMap));
      console.log(`[i] Datos normalizados de ${file}`);
      // console.log(normalizedData);
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

    mergedData = mergeDuplicates(mergedData);
    console.log("[i] Duplicados combinados");
    
    // YA POR SI ACASO ELIMINO LOS DUPLICADÍSIMOS
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
