import mongoose from "mongoose";

const Schema = mongoose.Schema;

var favSchema = new Schema({
  email: String,
  game: { type: Schema.ObjectId, ref: "Game" },
  addeddate: { type: Date, default: Date.now },
});

export const FavSchema = favSchema;
export default mongoose.model("Fav", FavSchema);
