import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RankingSchema = new Schema({
  game: { type: String, ref: "Game", required: true },
  rank_type: { type: String },
  rank: { type: Number },
  category: { type: String },
  // studio: { type: String },
  year: { type: Number },
});

RankingSchema.pre("save", async function (next) {
  const Game = mongoose.model("Game");
  const exists = await Game.exists({ slug: this.gameSlug });
  if (!exists) {
    return next(new Error(`El juego con slug "${this.gameSlug}" no existe`));
  }
  next();
});

export default mongoose.model("Ranking", RankingSchema);