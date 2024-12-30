import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gameAwardsSchema = new Schema({
  year: { type: Number, required: true },
  category: { type: String, required: true },
  game: { type: String, required: true },
  studio: { type: String, required: true }, // Si es true, premios a influencers, adaptaciones, etc. se omiten
  winner: { type: Boolean, required: true },
});

export const GameAwardsSchema = gameAwardsSchema;
export default mongoose.model("GameAwards", GameAwardsSchema);