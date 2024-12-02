import {
  readCSVFile,
  createCSVWriter,
  filterValues,
  createRecordObject,
} from "../my_utils/utils.js";

const csvFilePath = "origin_csv/dahlia-metacritic_game_user_comments.csv";
const outFilePath =
  "filtered_csv/filtered_dahlia-metacritic_game_user_comments.csv";

let uniquekey = "";
const MAX_REVIEWS_PG = 10;

/* Genera una clave única (tipo slug) para cada elemento = 1 COMM EN 1 JUEGO POR USUARIO */
function generateUniqueKey(element) {
  return (
    element["Title"] + "-" + element["Platform"] + "-" + element["Username"]
  );
}

/* Limita la cantidad de comentarios por juego y puntuación */
function limitReviewsByScore(records, maxReviews = MAX_REVIEWS_PG) {
  const gameScoreCountMap = new Map();

  return records.filter((record) => {
    const gameKeyScore =
      record["Title"] + "-" + record["Platform"] + "-" + record["Userscore"];

    if (!gameScoreCountMap.has(gameKeyScore)) {
      gameScoreCountMap.set(gameKeyScore, 0);
    }

    if (gameScoreCountMap.get(gameKeyScore) < maxReviews) {
      gameScoreCountMap.set(
        gameKeyScore,
        gameScoreCountMap.get(gameKeyScore) + 1
      );
      return true;
    }

    return false;
  });
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    console.log("[i] Archivo CSV leido");
    /* Elimina la columna 0, id inútil, y mueve al principio Title y Platform, y también Username */
    const headers = [
      "Title",
      "Platform",
      "Username",
      ...Object.keys(jsonArray[0])
        .slice(1)
        .filter(
          (key) => key !== "Title" && key !== "Platform" && key !== "Username"
        ),
    ];
    const csvWriter = createCSVWriter(outFilePath, headers);
    const recordsMap = new Map();

    jsonArray.forEach((element, index) => {
      uniquekey = generateUniqueKey(element);
      if (recordsMap.has(uniquekey)) {
        console.log(`[!] Duplicado L${index + 2}: ${uniquekey}`);
      } else {
        let filteredValues = filterValues(element, [0]);
        // Reordenar ligeramente cada fila acorde a los headers
        const temp = filteredValues[4];
        filteredValues.splice(4, 1);
        filteredValues.splice(2, 0, temp);
        // Quitar espacios innecesarios en el comentario
        filteredValues[headers.indexOf("Comment")] =
          filteredValues[headers.indexOf("Comment")].trim();
        const record = createRecordObject(headers, filteredValues);
        recordsMap.set(uniquekey, record);
      }
    });

    // Limitar los registros por puntuación antes de escribirlos en el archivo CSV
    const limitedRecords = limitReviewsByScore(Array.from(recordsMap.values()));
    // Escribir todos los registros únicos en el archivo CSV
    await csvWriter.writeRecords(limitedRecords);
    console.log(
      `[W] ${limitedRecords.length} récords escritos correctamente en ${outFilePath}`
    );
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
}

processCSV();
