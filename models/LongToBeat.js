import mongoose from "mongoose";

const Schema = mongoose.Schema;

const longToBeatSchema = new Schema({
  game: { type: String, ref: "Game", required: true },
  all_playstyles: { type: Number },
  completionists: { type: Number },
  with_extras: { type: Number },
  main_story: { type: Number },
});

longToBeatSchema.pre("save", async function (next) {
  const Game = mongoose.model("Game");
  const exists = await Game.exists({ slug: this.gameSlug });
  if (!exists) {
    return next(new Error(`El juego con slug "${this.gameSlug}" no existe`));
  }
  next();
});

export const LongToBeatSchema = longToBeatSchema;
export default mongoose.model("LongToBeat", LongToBeatSchema);
