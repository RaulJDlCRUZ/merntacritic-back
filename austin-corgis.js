import fs from "fs";
import csv from "fast-csv";
import { createObjectCsvWriter } from "csv-writer";
import { austinCorgisRemoval } from "./columnas-eliminadas.js";

const austin_corgis_video_games = new austinCorgisRemoval().filterlist;

const csvFilePath = "origin_csv/austin-corgis-video_games.csv";
const outFilePath = "origin_csv/filtered_austin_corgis_video_games.csv";
const jsonArray = [];
const uniqueList = [];

let uniquekey = "";

function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function getFilteredHeaders(jsonArray, filterList) {
  return Object.keys(jsonArray[0]).filter(
    (value, index) => !filterList.includes(index)
  );
}

function sanitizeHeaders(headers) {
  return headers.map((element) =>
    element
      .replace(/\./g, "-")
      .replace(/\s+/g, "")
      .replace(/\+/g, "")
      .replace(/\?/g, "")
  );
}

function createCSVWriter(filePath, headers) {
  return createObjectCsvWriter({
    path: filePath,
    header: headers.map((element) => {
      return { id: element, title: element };
    }),
  });
}

function generateUniqueKey(element) {
  return (
    element["Title"] +
    "-" +
    element["Release.Console"] +
    "-" +
    element["Release.Year"]
  );
}

function filterValues(element, filterList) {
  return Object.values(element).filter(
    (value, index) => !filterList.includes(index)
  );
}

function createRecordObject(headers, values) {
  let newObject = {};
  for (let i = 0; i < headers.length; i++) {
    newObject[headers[i]] = values[i];
  }
  return newObject;
}

async function processCSV() {
  try {
    const jsonArray = await readCSVFile(csvFilePath);
    const headers = getFilteredHeaders(jsonArray, austin_corgis_video_games);
    const newHeaders = sanitizeHeaders(headers);
    const csvWriter = createCSVWriter(outFilePath, newHeaders);
    const recordsToWrite = [];

    jsonArray.forEach((element) => {
      uniquekey = generateUniqueKey(element);

      if (uniqueList.includes(uniquekey)) {
        console.log("[!] " + uniquekey);
      } else {
        uniqueList.push(uniquekey);
        const filteredValues = filterValues(element, austin_corgis_video_games);
        const newObject = createRecordObject(newHeaders, filteredValues);
        recordsToWrite.push(newObject);
      }
    });

    await csvWriter.writeRecords(recordsToWrite);
    console.log("[W] All records written successfully");
  } catch (error) {
    console.error("Error processing CSV file:", error);
  }
}

processCSV();
