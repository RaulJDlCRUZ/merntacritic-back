import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { SalesHeaders, GameHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  removeDuplicates,
  readCsv,
  mergeDuplicates,
  generateSlug,
  generateSlugComplex,
  findDuplicateSlugs,
} from "../my_utils/merge-utils.js";

const outputPath = "merge_data/sales.csv";
const saleHeaders = new SalesHeaders().headers;
const salescolumnMap = new SalesHeaders().columnMap;
const gamescolumnMap = new GameHeaders().columnMap;
const csvWriter = createObjectCsvWriter({
  path: outputPath,
  header: saleHeaders,
});

const input_files = [
  "filtered_csv/both/filtered_bakikhan-video-game-sales.csv",
  "filtered_csv/console/filtered_austin_corgis_video_games.csv",
  // Agrega más rutas de CSV según sea necesario
];

const game_list = readCsv("merge_data/games.csv");

// Función principal para crear un CSV de ventas
async function generateSalesCsv() {
  let salesData = [];
  for (const file of input_files) {
    const data = readCsv(file);
    console.log(`[i] Datos leídos de ${file}`);
    data.forEach((row) => {
      let gamerow = normalizeRow(row, gamescolumnMap, false);
      let simpleslug = generateSlug(gamerow.title);
      let complexslug =
        gamerow.platform && gamerow.release_date
          ? generateSlugComplex(
              gamerow.title,
              gamerow.platform,
              gamerow.release_date
            )
          : null;
      //   console.log(simpleslug, complexslug);
      let my_game = game_list.find(
        (game) =>
          game["Slug"] === simpleslug ||
          (complexslug && game["Slug"] === complexslug)
      );

      if (my_game) {
        console.log(my_game["Slug"]);
        let sale = normalizeRow(row, salescolumnMap, false);
        sale["game"] = my_game["Slug"];
        salesData.push(sale);
      } else {
        console.warn(`[!] no match: ${simpleslug}`);
      }
    });
  }

//   console.log(salesData);
  await csvWriter.writeRecords(salesData);
  console.log(`CSV de ventas generado en: ${outputPath}`);
}

// console.log(game_list);
generateSalesCsv().catch(console.error);
