import fs from "fs";
import csv from "csv-parser";
import { Parser } from "json2csv";
import { DateTime } from "luxon";

const results = [];
const csvFilePath = "origin_csv/mohamed-steam_game_reviews.csv";
const outFilePath = "filtered_csv/reordered_mohamed-steam_game_reviews.csv";
const MAX_REVIEWS = 100;

function printSliceResults(gameReviewCount) {
  console.log("Number of reviews for each game:");
  for (const [game, count] of Object.entries(gameReviewCount)) {
    if (count < MAX_REVIEWS) {
      console.log(`[!] ${game}: ${count}`);
    } else {
      console.log(`    ${game}: ${count}`);
    }
  }
}

function correctDateFormat(dateString) {
  const formats = ["MMMM d, yyyy", "MMMM d", "d MMMM, yyyy", "d MMMM"];

  for (const format of formats) {
    const date = DateTime.fromFormat(dateString, format);
    if (date.isValid) {
      return date.toISODate(); // Devuelve fecha en formato ISO (yyyy-MM-dd)
    }
  }
  // Si no se encuentra un formato válido, se devuelve la fecha original
  return dateString;
}

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    const gameReviewCount = {};
    const originalRowCount = results.length;

    const rearrangedData = results.reduce((acc, row) => {
      const { game_name, username, date, ...rest } = row;
      const cleanedUsername = username.split("\n")[0]; // Keep only the username before the new line character
      const correctedDate = correctDateFormat(date); // Correct the date format

      if (!gameReviewCount[game_name]) {
        gameReviewCount[game_name] = 0;
      }

      if (gameReviewCount[game_name] < MAX_REVIEWS) {
        acc.push({
          game_name,
          username: cleanedUsername,
          date: correctedDate,
          ...rest,
        });
        gameReviewCount[game_name]++;
      }

      return acc;
    }, []);

    // Define fields after processing data
    const fields = [
      "game_name",
      "username",
      "date",
      ...Object.keys(rearrangedData[0] || {}).filter(
        (key) => key !== "game_name" && key !== "username" && key !== "date"
      ),
    ];

    const json2csvParser = new Parser({ fields });

    // printSliceResults(gameReviewCount);
    console.log(`${rearrangedData.length} / ${originalRowCount}`);

    // const someRows = rearrangedData.slice(0, 15);
    // console.log(someRows);

    const csvData = json2csvParser.parse(rearrangedData);
    // console.log(csvData);
    fs.writeFileSync(outFilePath, csvData);
    console.log("CSV file successfully processed and saved.");
  });
