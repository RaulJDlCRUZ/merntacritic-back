import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { ReviewHeaders, GameHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  readCsv,
  generateSlug,
  generateSlugComplex,
  normalizePlatform,
} from "../my_utils/merge-utils.js";

import { readCSVFile } from "../my_utils/utils.js";

const outputPath = "merge_data/reviews.csv";
const reviewHeaders = new ReviewHeaders().headers;
const reviewColumnMap = new ReviewHeaders().columnMap;
const gamesColumnMap = new GameHeaders().columnMap;

const input_files = [
  "filtered_csv/both/filtered_dahlia-metacritic_game_user_comments.csv",
  "filtered_csv/both/filtered_jvc.csv",
  "filtered_csv/both/filtered_vandal.csv",
  "filtered_csv/pc-steam/filtered_mohamed-steam_game_reviews.csv",
];

const game_list = readCsv("merge_data/games.csv");
const isPcSteam = input_files.some((file) => file.includes("/pc-steam/"));

function createReviewRow(row, gamerow, my_game) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(
    `[i] ${gamerow.title} ${gamerow.platform} = ${my_game["Slug"]}`
  );
  let reviewrow = normalizeRow(row, reviewColumnMap, false);
  reviewrow.game = my_game.slug;
  process.stdout.write(` ${reviewrow.username}`);
  return reviewrow;
}

/* Función principal */
async function generateReviewsCsv() {
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: reviewHeaders,
  });
  let reviewsData = [];
  let prevTitle = "";
  let prevPlatform = "";
  let prevGame = null;

  for (const file of input_files) {
    const data = readCsv(file);
    console.log(`\n[i] Datos leídos de ${file}`);
    data.forEach((row) => {
      let gamerow = normalizeRow(row, gamesColumnMap, isPcSteam);

      if (gamerow.title === prevTitle && gamerow.platform === prevPlatform) {
        reviewsData.push(createReviewRow(row, gamerow, prevGame));
      } else {
        let simpleslug = generateSlug(gamerow.title);
        let complexslug = generateSlugComplex(
          gamerow.title,
          normalizePlatform(gamerow.platform),
          gamerow.release_date
        ); // los de pc no los reconoce!
        // console.log(simpleslug, complexslug);
        let my_game = game_list.find(
          (game) =>
            game["Slug"] === simpleslug ||
            (complexslug && game["Slug"] === complexslug)
        );

        let my_game2 = game_list.find(
          (game) =>
            game["Title"] === gamerow.title &&
            game["Platform"] === gamerow.platform &&
            game["Platform"] === "PC"
        );

        if (my_game) {
          reviewsData.push(createReviewRow(row, gamerow, my_game));
          prevGame = my_game;
        } else if (my_game2) {
          reviewsData.push(createReviewRow(row, gamerow, my_game2));
          prevGame = my_game2;
        } else {
          console.warn(
            `[!] Juego no encontrado: ${gamerow.title} | ${simpleslug} | ${complexslug}`
          );
        }
      }
    });
  }
  console.log(reviewsData);
  console.log(`[i] Datos normalizados: ${reviewsData.length}`);
  await csvWriter.writeRecords(reviewsData);
}

generateReviewsCsv();
