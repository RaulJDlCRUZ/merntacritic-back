import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { LongToBeatHeaders, GameHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  readCsv,
  generateSlug,
  generateSlugComplex,
  normalizePlatform,
} from "../my_utils/merge-utils.js";

const outputPath = "merge_data/longtobeat.csv";
const ltbHeaders = new LongToBeatHeaders().headers;
const ltbColumnMap = new LongToBeatHeaders().columnMap;
const gamesColumnMap = new GameHeaders().columnMap;

const input_files = [
  "filtered_csv/console/filtered_austin_corgis_video_games.csv",
  "filtered_csv/pc-steam/filtered_th_game_info.csv",
];

const game_list = readCsv("merge_data/games.csv");

function createLongToBeatRow(row, gamerow, my_game) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(
    `[i] ${gamerow.title} ${gamerow.platform} = ${my_game["Slug"]}`
  );
  let ltbrow = normalizeRow(row, ltbColumnMap, false);
  ltbrow["Game"] = my_game["Slug"];
  process.stdout.write(
    ` ${ltbrow.all_playstyles} ${ltbrow.main_story} ${ltbrow.completionists} ${ltbrow.with_extras}`
  );
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
    console.log(isPcSteam);
    console.log(`\n#####################\n[i] Datos leídos de ${file}`);
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
      } else {
        console.warn(`[!] No se ha encontrado el juego ${gamerow.title}`);
      }
    });
  }
}

generateLongToBeatCsv();
