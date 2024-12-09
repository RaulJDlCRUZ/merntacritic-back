import { createReadStream } from "fs";
import csv from "csv-parser";

const platforms = new Set();

const game_list = "merge_data/games.csv";

createReadStream(game_list)
  .pipe(csv())
  .on("data", (row) => {
    if (row.Platform && !row.Platform.includes("[")) {
      platforms.add(row.Platform);
    }
  })
  .on("end", () => {
    console.log(Array.from(platforms).sort());
  });
