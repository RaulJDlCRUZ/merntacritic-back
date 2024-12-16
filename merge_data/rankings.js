import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { RankingHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  readCsv,
  generateSlug,
} from "../my_utils/merge-utils.js";
import { readCSVFile } from "../my_utils/utils.js";

const default_year = 2024;
const input_file = "origin_csv/mohamed-games_ranking.csv";
const outputPath = "merge_data/rankings.csv";
const rankingHeaders = new RankingHeaders().headers;
const rankingColumnMap = new RankingHeaders().columnMap;

function createRankingRow(row, final_slug) {
  let rnkrow = normalizeRow(row, rankingColumnMap, false);
  rnkrow.game = final_slug;
  rnkrow.year = default_year;
  return rnkrow;
}

async function createRankingsCSV() {
  const game_list = await readCSVFile("merge_data/games.csv");
  const data = readCsv(input_file);
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: rankingHeaders,
  });

  let slugDictionary = {};
  let rankings = [];

  data.forEach((row) => {
    if (slugDictionary[row["game_name"]]) {
      console.log(
        `[!] ${row["game_name"]} ya se tiene como ${
          slugDictionary[row["game_name"]]
        }`
      );
      rankings.push(createRankingRow(row, slugDictionary[row["game_name"]]));
      return;
    }
    const game = game_list.find(
      (game) => game.Slug === generateSlug(row["game_name"])
    );
    if (game) {
      slugDictionary[row["game_name"]] = game.Slug;
      console.log(`[i] ${row["game_name"]} equivale a ${game.Slug}`);
      rankings.push(createRankingRow(row, game.Slug));
      return;
    }

    const game2 = game_list.find((game) => game.Title === row["game_name"]);
    if (game2) {
      slugDictionary[row["game_name"]] = game2.Slug;
      console.log(`[i] ${row["game_name"]} equivale a ${game2.Slug}`);
      rankings.push(createRankingRow(row, game2.Slug));
      return;
    }

    console.warn(`No se encontró ${row["game_name"]}`);
  });

  await csvWriter.writeRecords(rankings);
  console.log(`[i] Datos normalizados: ${rankings.length}`);
}

createRankingsCSV();
