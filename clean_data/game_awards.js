import { readCSVFile, createCSVWriter } from "../my_utils/utils.js";

const csvFilePath1 = "origin_csv/game_awards_1419.csv";
const csvFilePath2 = "origin_csv/game_awards_2023.csv";
// RECOPILADOS 13 DICIEMBRE 2024
const csvFilePath3 = "origin_csv/game_awards_2024.csv";
const outFilePath = "filtered_csv/filtered_game_awards_updated.csv";

async function processCSV() {
  try {
    const data1 = await readCSVFile(csvFilePath1);
    const data2 = await readCSVFile(csvFilePath2);
    const data3 = await readCSVFile(csvFilePath3);
    // Combina la información de ambos archivos CSV utilizando los encabezados de csvFilePath2 y eliminando la última columna de data1
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
    await csvWriter.writeRecords(updatedData.concat(data3)); //data3 de por sí cuenta con el formato correcto
    console.log("CSV files processed successfully.");
  } catch (error) {
    console.error("Error processing CSV files:", error);
  }
}

processCSV();
