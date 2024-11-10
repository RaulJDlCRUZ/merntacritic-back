import fs from "fs";
import csv from "csv-parser";
import Parser from "json2csv";

const csvFilePath = "origin_csv/mohamed-steam_games_description.csv";
const outFilePath = "filtered_csv/reordered_mohamed-steam_games_description.csv";

const results = [];

//TODO comprobar que ordena correctamente
fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const rearrangedData = results.map(row => {
            const { game_name, username, ...rest } = row;
            return { game_name, username, ...rest };
        });

        const fields = ['game_name', 'username', ...Object.keys(results[0]).filter(key => key !== 'game_name' && key !== 'username')];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(rearrangedData);

        fs.writeFileSync(outputFilePath, csvData);
        console.log('CSV file successfully processed and saved.');
    });