import { createObjectCsvWriter } from "csv-writer"; // Para escribir CSV
import { SalesHeaders, GameHeaders } from "../my_utils/merge-headers.js";
import {
  normalizeRow,
  readCsv,
  generateSlug,
  generateSlugComplex,
  normalizePlatform,
} from "../my_utils/merge-utils.js";

import { readCSVFile } from "../my_utils/utils.js";

const outputPath = "merge_data/sales.csv";
const outputPath2 = "merge_data/sales_unique.csv";
const saleHeaders = new SalesHeaders().headers;
const salescolumnMap = new SalesHeaders().columnMap;
const gamescolumnMap = new GameHeaders().columnMap;

const input_files = [
  "filtered_csv/both/filtered_bakikhan-video-game-sales.csv",
  "filtered_csv/console/filtered_austin_corgis_video_games.csv",
];

const game_list = readCsv("merge_data/games.csv");

// Función para eliminar duplicados
function removeSalesDuplicates(data) {
  const seen = new Set();
  return data.filter((row) => {
    const key = `${row["Game"]}`;
    if (seen.has(key)) {
      if (row["Other Sales"] && !row["Global Sales"]) {
        console.warn(`[!] Duplicado a eliminar: ${key}`);
        return false;
      }
    } else {
      seen.add(key);
      return true;
    }
  });
}

// Función para generar un CSV de ventas únicas
async function generateUniqueSalesCsv() {
  const salesData = await readCSVFile(outputPath);
  const headers = Object.keys(salesData[0]);
  const csvWriter = createObjectCsvWriter({
    path: outputPath2,
    header: headers.map((header) => ({ id: header, title: header })),
  });
  const uniqueSalesData = removeSalesDuplicates(salesData);
  await csvWriter.writeRecords(Array.from(uniqueSalesData));
}

// Función principal para crear un CSV de ventas
async function generateSalesCsv() {
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: saleHeaders,
  });
  let salesData = [];
  for (const file of input_files) {
    const data = readCsv(file);
    console.log(`\n[i] Datos leídos de ${file}`);
    data.forEach((row) => {
      let gamerow = normalizeRow(row, gamescolumnMap, false);
      let simpleslug = generateSlug(gamerow.title);
      let complexslug =
        gamerow.platform && gamerow.release_date
          ? generateSlugComplex(
              gamerow.title,
              normalizePlatform(gamerow.platform),
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
        // console.log(my_game["Slug"]);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`[i] ${my_game["Slug"]}`);
        let sale = normalizeRow(row, salescolumnMap, false);
        sale["game"] = my_game["Slug"];
        salesData.push(sale);
      } else {
        console.warn(`\n[!] no match: ${simpleslug} | ${complexslug}\n`);
      }
    });
  }

  //   console.log(salesData);
  await csvWriter.writeRecords(salesData);
  console.log(`\nCSV de ventas generado en: ${outputPath}`);
}

// generateSalesCsv();
generateUniqueSalesCsv();
