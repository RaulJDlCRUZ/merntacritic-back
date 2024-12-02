/* Este archivo contiene funciones de utilidad para la manipulación de archivos csv */
import fs from "fs";
import csv from "fast-csv";
import { createObjectCsvWriter } from "csv-writer";
import { ESRBRating, PEGIRating } from "./gameRating.js";

const ESRB = new ESRBRating();
const PEGI = new PEGIRating();

/* Objeto fs lee el archivo csv y lo convierte en un array de objetos */
export function readCSVFile(filePath) {
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

/* Crea un objeto csv-writer a partir de los headers filtrados */
export function createCSVWriter(filePath, headers) {
  return createObjectCsvWriter({
    path: filePath,
    header: headers.map((element) => {
      return { id: element, title: element };
    }),
  });
}

/* Filtra los valores de un objeto según una lista de índices */
export function filterValues(element, filterList) {
  return Object.values(element).filter(
    (value, index) => !filterList.includes(index)
  );
}

/* Obtiene los headers del archivo csv y filtra los que no se necesitan */
export function getFilteredHeaders(jsonArray, filterList) {
  return Object.keys(jsonArray[0]).filter(
    (value, index) => !filterList.includes(index)
  );
}

/* Crea un objeto a partir de los headers y los valores de un elemento */
export function createRecordObject(headers, values) {
  let newObject = {};
  for (let i = 0; i < headers.length; i++) {
    newObject[headers[i]] = values[i];
  }
  return newObject;
}

/* Obtengo un valor por el estándar de clasificación */
export function createRatingObject(standard, value) {
  if (standard === "PEGI") {
    // console.log({ [standard]: PEGI.getRating(value) });
    return { [standard]: PEGI.getRating(value) };
  } else if (standard === "ESRB") {
    return { [standard]: ESRB.getRating(value) };
  }
}
