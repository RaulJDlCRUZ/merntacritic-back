import { connect, Schema, model, connection } from "mongoose";
import csv from "csv-parser";
import { createReadStream } from "fs";

connect("mongodb://localhost:27017/merntacritic", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const gameSchema = new Schema({
  title: String,
  genre: String,
  releaseDate: Date,
  rating: Number,
});

const Game = model("Game", gameSchema);

const results = [];

createReadStream("games.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    Game.insertMany(results)
      .then(() => {
        console.log("Data inserted successfully");
        connection.close();
      })
      .catch((error) => {
        console.error("Error inserting data: ", error);
        connection.close();
      });
  });
