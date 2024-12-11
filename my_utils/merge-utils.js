import { readFileSync } from "fs";
import { DateTime } from "luxon";
import consoles from "../my_utils/console-names.js";
import papa from "papaparse"; // Para leer CSV
const { parse } = papa;

/* Normaliza el nombre de una plataforma de consola */
export function normalizePlatform(platformName) {
  // Busca en todas las posibles variantes de nombres
  const normalizedConsole = Object.values(consoles).find((console) =>
    console.possibleNames.some(
      (name) =>
        platformName
          .toLowerCase()
          .localeCompare(name.toLowerCase(), undefined, {
            sensitivity: "base",
          }) === 0
    )
  );

  // Devuelve el identificador si se encuentra, sino el nombre original
  return normalizedConsole ? normalizedConsole.identifier : platformName;
}

/* Función para encontrar slugs duplicados */
export const findDuplicateSlugs = (data) => {
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

/* Función para combinar datos duplicados basándose en la longitud de ciertos campos */
export const old_mergeDuplicates = (data) => {
  const mergedData = [];
  const seen = new Map();

  data.forEach((row) => {
    // console.log(row);
    const uniqueKey = `${row.title}-${row.platform}-${row.release_date}`;
    // console.log(uniqueKey);
    if (seen.has(uniqueKey)) {
      const existingRow = seen.get(uniqueKey);
      console.log(row);
      console.log(existingRow);
      // Vamos a intentar unir la información de los nuevos registros
    } else {
      seen.set(uniqueKey, row);
    }
  });

  seen.forEach((value) => mergedData.push(value));
  return mergedData;
};

/* Función para combinar datos duplicados basándose en la longitud de ciertos campos */
function mergeRows(existingRow, newRow) {
  // Unir genres de juegos. considero de paso si hay vacíos
  const parseGenre = (genre) => {
    try {
      return JSON.parse(genre.replace(/'/g, '"'));
    } catch (e) {
      return genre;
    }
  };

  const merged_genres = JSON.stringify(
    []
      .concat(parseGenre(existingRow.genre))
      .concat(parseGenre(newRow.genre))
      .filter(Boolean)
  );

  if (merged_genres === "[]") {
    newRow.genre = null;
  } else {
    const cleanedGenres = merged_genres.includes("\\")
      ? merged_genres.replace(/\\/g, "")
      : merged_genres;

    /*
    newRow.genre = JSON.stringify(
      JSON.parse(cleanedGenres)
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index)
    );
    */
  }

  // Unir publishers/devs de juegos. considero de paso si hay vacíos
  if (
    existingRow.publisher &&
    !existingRow.developer &&
    !newRow.publisher &&
    newRow.developer
  ) {
    newRow.publisher = existingRow.publisher;
  }

  if (
    existingRow.developer &&
    !existingRow.publisher &&
    !newRow.developer &&
    newRow.publisher
  ) {
    newRow.developer = existingRow.developer;
  }

  // Me quedo con la fecha de lanzamiento más extensa == precisa
  if (
    String(existingRow.release_date).length > String(newRow.release_date).length
  ) {
    newRow.release_date = existingRow.release_date;
  }

  // Me quedo con la web más extensa == precisa
  if (String(existingRow.website).length > String(newRow.website).length) {
    newRow.website = existingRow.website;
  }

  // Me quedo con la descripción más extensa == precisa
  if (
    String(existingRow.description).length > String(newRow.description).length
  ) {
    newRow.description = existingRow.description;
  }

  // Me quedo con el metascore que no es nulo
  if (existingRow.metascore && !newRow.metascore) {
    newRow.metascore = existingRow.metascore;
  }

  // Lo mismo con user score
  if (existingRow["User Score"] && !newRow["User Score"]) {
    newRow["User Score"] = existingRow["User Score"];
  }

  // Unión de age_ratings de diferentes estándares, si sucede
  if (
    (String(existingRow["Age Rating"]).includes("PEGI") &&
      String(newRow["Age Rating"]).includes("ESRB")) ||
    (String(existingRow["Age Rating"]).includes("ESRB") &&
      String(newRow["Age Rating"]).includes("PEGI"))
  ) {
    let unified_aR = [];
    unified_aR[0] = existingRow.age_rating;
    unified_aR[1] = newRow.age_rating;
    newRow.age_rating = JSON.stringify(unified_aR);
  }

  return newRow;
}

export function mergeDuplicates(data) {
  const mergedData = new Set();
  const seen = new Map();

  data.forEach((row) => {
    // const uniqueKey = `${String(row.title).trim()}-${row.platform}-${String(row.release_date).trim().slice(0, 4)}`;
    const uniqueKey = `${String(row.title)
      .replace(/[^a-zA-Z0-9]/g, "")
      .trim()}+${String(row.slug).trim()}`;

    if (seen.has(uniqueKey)) {
      const existingRow = seen.get(uniqueKey);
      // Combinar información de los registros
      const mergedRow = mergeRows(existingRow, row);
      seen.delete(uniqueKey);
      seen.set(uniqueKey, mergedRow);
    } else {
      seen.set(uniqueKey, row);
    }
  });

  seen.forEach((value) => mergedData.add(value));
  // console.log(`[i] -> ${mergedData.size} registros`);
  return Array.from(mergedData);
}

/* Función para leer un CSV y devolver un array de objetos JSON */
export const readCsv = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const { data } = parse(content, { header: true, skipEmptyLines: true });
  return data;
};

/* Función para comprobar si una cadena no tiene ninguna letra ASCII, fuente de duplicados! */
export const hasNoAsciiLetters = (str) => {
  return !/[a-zA-Z]/.test(str);
};

/* Eliminar duplicados en base a una clave única */
export const removeDuplicates = (data) => {
  const seen = new Set();
  return data.filter((row) => {
    // const uniqueKey = `${String(row.title).trim()}-${row.platform}-${row.release_date}`;
    const uniqueKey = String(row.slug).trim();
    if (seen.has(uniqueKey) && hasNoAsciiLetters(row.title)) {
      return false;
    } else {
      seen.add(uniqueKey);
      return true;
    }
  });
};

/* Función para generar un slug más complejo, con la plataforma si es consola, o año */
export const generateSlugComplex = (name, platform, releaseDate) => {
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

/* Función para generar un slug a partir del nombre de un juego */
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD") // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y símbolos por guiones
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio y al final
};

/* Busca en cada columna de un CSV un valor asociado al columnmap */
export const normalizeRow = (row, columnMap, isPcSteam) => {
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

  // Para una columna de precio (o descuento), elimina el símbolo del dolar
  ["price", "discounted_price"].forEach((field) => {
    if (normalizedRow[field]) {
      normalizedRow[field] = normalizedRow[field].replace("$", "");
    }
  });

  // Para algún valor de score de usuario, si hay tbd establecerlo como null
  if (normalizedRow.user_score === "tbd") {
    normalizedRow.user_score = null;
  }

  return normalizedRow;
};
