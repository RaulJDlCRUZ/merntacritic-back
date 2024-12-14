import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { LongToBeatHeaders, GameHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  readCsv,
  generateSlug,
  generateSlugComplex,
  normalizePlatform,
} from "../my_utils/merge-utils.js";
import { readCSVFile } from "../my_utils/utils.js";

const outputPath = "merge_data/longtobeat.csv";
const outputPath2 = "merge_data/longtobeat_cleaned.csv";
const ltbHeaders = new LongToBeatHeaders().headers;
const ltbColumnMap = new LongToBeatHeaders().columnMap;
const gamesColumnMap = new GameHeaders().columnMap;

const input_files = [
  "filtered_csv/console/filtered_austin_corgis_video_games.csv",
  "filtered_csv/pc-steam/filtered_th_game_info.csv",
];

const game_list = readCsv("merge_data/games.csv");

/* Función que cambia ceros por null */
function removeZeros(row) {
  if (row["All Playstyles"] === "0" || row["All Playstyles"] === "0.0") {
    row["All Playstyles"] = null;
  }
  if (row["Main Story"] === "0" || row["Main Story"] === "0.0") {
    row["Main Story"] = null;
  }
  if (row["Completionists"] === "0" || row["Completionists"] === "0.0") {
    row["Completionists"] = null;
  }
  if (row["With Extras"] === "0" || row["With Extras"] === "0.0") {
    row["With Extras"] = null;
  }
  return row;
}

/* Quitaremos registros inútiles, como juegos con 0h para completarse o sin contenido */
function removeUnnecesary(data) {
  return data.filter((row) => {
    let newrow = removeZeros(row);
    if (
      !newrow["All Playstyles"] &&
      !newrow["Main Story"] &&
      !newrow["Completionists"] &&
      !newrow["With Extras"]
    ) {
      console.warn(`[!] Registro nulo: ${row["Game"]}`);
      return false;
    } else {
      console.log(
        `${row["Game"]} ${row["All Playstyles"]} ${row["Main Story"]} ${row["Completionists"]} ${row["With Extras"]}`
      );
      return true;
    }
  });
}

/* Función para encontrar juegos duplicados */
function findDuplicateGames(data) {
  const gameMap = new Map();
  const duplicates = [];

  data.forEach((row) => {
    const gameKey = `${row["Game"]}`;
    if (gameMap.has(gameKey)) {
      console.warn(`[!] Juego duplicado: ${gameKey}`);
      duplicates.push(row);
    } else {
      gameMap.set(gameKey, true);
    }
  });

  return duplicates;
}

// Función para generar un CSV de ventas únicas
async function generateUniqueLTBCSV() {
  const ltbData = await readCSVFile(outputPath);
  const headers = Object.keys(ltbData[0]);
  const csvWriter = createObjectCsvWriter({
    path: outputPath2,
    header: headers.map((header) => ({ id: header, title: header })),
  });
  // const duplicates = findDuplicateGames(ltbData);
  const clean_ltbData = removeUnnecesary(ltbData);
  await csvWriter.writeRecords(Array.from(clean_ltbData));
}

/* Genera una fila de acuerdo a los nombres de columnas LTB */
function createLongToBeatRow(row, gamerow, my_game) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(
    `[i] ${gamerow.title} ${gamerow.platform} = ${my_game["Slug"]}`
  );
  let ltbrow = normalizeRow(row, ltbColumnMap, false);
  ltbrow.game = my_game["Slug"];
  process.stdout.write(
    ` ${ltbrow.all_playstyles} ${ltbrow.main_story} ${ltbrow.completionists} ${ltbrow.with_extras}`
  );
  console.log(ltbrow.game);
  return ltbrow;
}

/* Función principal */
async function generateLongToBeatCsv() {
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: ltbHeaders,
  });

  let longToBeatData = [];
  for (const file of input_files) {
    const data = readCsv(file);
    let isPcSteam = file.includes("/pc-steam/");
    console.log(
      `\n#####################\n[i] Datos leídos de ${file}:${isPcSteam}`
    );
    data.forEach((row) => {
      let gamerow = normalizeRow(row, gamesColumnMap, isPcSteam);
      let simpleslug = generateSlug(gamerow.title);
      let complexslug = generateSlugComplex(
        gamerow.title,
        normalizePlatform(gamerow.platform),
        gamerow.release_date
      );
      let my_game = game_list.find(
        (game) =>
          game["Slug"] === simpleslug ||
          (complexslug && game["Slug"] === complexslug)
      );

      if (my_game) {
        longToBeatData.push(createLongToBeatRow(row, gamerow, my_game));
        return;
      }

      let my_game2 = game_list.find(
        (game) =>
          game["Title"] === gamerow.title &&
          game["Platform"] === gamerow.platform &&
          game["Platform"] === "PC"
      );

      if (my_game2) {
        longToBeatData.push(createLongToBeatRow(row, gamerow, my_game2));
        return;
      }

      // Algunos símbolos dan problemas
      let my_game3 = game_list.find((game) => {
        const normalizeTitle = (title) =>
          title.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return (
          normalizeTitle(game["Title"]) === normalizeTitle(gamerow.title) &&
          game["Platform"] === gamerow.platform &&
          game["Platform"] === "PC"
        );
      });

      if (my_game3) {
        longToBeatData.push(createLongToBeatRow(row, gamerow, my_game3));
      } else {
        console.warn(`[!] No se ha encontrado el juego ${gamerow.title}`);
      }
    });
  }
  await csvWriter.writeRecords(longToBeatData);
  console.log(`[i] Datos normalizados: ${longToBeatData.length}`);
}

// generateLongToBeatCsv();
generateUniqueLTBCSV();
