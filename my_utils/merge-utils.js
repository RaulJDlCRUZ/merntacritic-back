import { readFileSync } from "fs";
import { DateTime } from "luxon";
import papa from "papaparse"; // Para leer CSV
const { parse } = papa;

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
export const mergeDuplicates = (data) => {
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

/* Función para leer un CSV y devolver un array de objetos JSON */
export const readCsv = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const { data } = parse(content, { header: true, skipEmptyLines: true });
  return data;
};

/* Eliminar duplicados en base a una clave única */
export const removeDuplicates = (data) => {
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
