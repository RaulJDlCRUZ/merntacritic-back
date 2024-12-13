import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SalesSchema = new Schema({
  game: { type: String, ref: "Game", required: true },
  na_sales: { type: Number },
  eu_sales: { type: Number },
  jp_sales: { type: Number },
  other_sales: { type: Number },
  global_sales: { type: Number },
});

SalesSchema.pre("save", async function (next) {
  const Game = mongoose.model("Game");
  const exists = await Game.exists({ slug: this.gameSlug });
  if (!exists) {
    return next(new Error(`El juego con slug "${this.gameSlug}" no existe`));
  }
  next();
});

export default mongoose.model("Sales", SalesSchema);
