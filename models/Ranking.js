import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RankingSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  rank_type: { type: String },
  rank: { type: Number },
  category: { type: String },
  studio: { type: String },
  year: { type: Number },
});

export default mongoose.model("Ranking", RankingSchema);