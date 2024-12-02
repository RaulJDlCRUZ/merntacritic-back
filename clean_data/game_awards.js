import { readCSVFile, createCSVWriter } from "../my_utils/utils.js";

const csvFilePath1 = "origin_csv/game_awards_1419.csv";
const csvFilePath2 = "origin_csv/game_awards_2023.csv";
const outFilePath = "filtered_csv/filtered_game_awards.csv";

async function processCSV() {
  try {
    const data1 = await readCSVFile(csvFilePath1);
    const data2 = await readCSVFile(csvFilePath2);
    // Combine data from both CSV files using headers from csvFilePath2 and removing the last column from data1
    const headers = Object.keys(data2[0]);
    const csvWriter = createCSVWriter(outFilePath, headers);

    const modifiedData1 = data1.map((row) => {
      const newRow = {};
      headers.forEach((header, index) => {
        newRow[header] = row[Object.keys(row)[index]];
      });
      return newRow;
    });

    // Ordenar data2 por Year
    data2.sort((a, b) => a.Year - b.Year);
    // Combinar datos de ambos archivos CSV
    const updatedData = modifiedData1.concat(data2);

    // Reemplazar 1 y 0 de Winner por true o false
    updatedData.forEach((row) => {
      row.Winner = row.Winner === "1" ? "true" : "false";
    });

    // Write combined data to the output file
    await csvWriter.writeRecords(updatedData);
    console.log("CSV files processed successfully.");
  } catch (error) {
    console.error("Error processing CSV files:", error);
  }
}

processCSV();
