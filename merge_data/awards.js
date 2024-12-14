import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { readCSVFile } from "../my_utils/utils.js";
import {
  normalizeRow,
  readCsv,
  generateSlug,
  generateSlugComplex,
  normalizePlatform,
} from "../my_utils/merge-utils.js";
import { GameAwardsHeaders, GameHeaders } from "../my_utils/merge-headers.js";
const outputPath = "merge_data/awards.csv";
const awardHeaders = new GameAwardsHeaders().headers;
const awardColumnMap = new GameAwardsHeaders().columnMap;
const gamesColumnMap = new GameHeaders().columnMap;

const input_file = "filtered_csv/both/filtered_game_awards_updated.csv";
const game_list = readCsv("merge_data/games.csv");

async function gameAwardFinder() {
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: awardHeaders,
  });

  const awardsList = await readCSVFile(input_file);

  awardsList.forEach((award) => {
    const game = game_list.find((game) => game.title === award.game);
    if (game) {
      const awardRow = {
        game: game["Slug"],
        year: award.year,
        category: award.category,
        winner: award.winner,
      };
      console.log(awardRow);
    } else {
      console.warn(`[!] Juego no encontrado: ${award.game}`);
    }
  });

  //   await csvWriter.writeRecords(recordsToWrite);
}

gameAwardFinder();
