import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  game: { type: String, ref: "Game", required: true },
  username: { type: String },
  review_text: { type: String },
  review_score: { type: Number },
  review_votes: { type: Number },
  hours_played: { type: Number },
  recommendation: { type: String },
  date: { type: Date },
});

reviewSchema.pre("save", async function (next) {
  const Game = mongoose.model("Game");
  const exists = await Game.exists({ slug: this.gameSlug });
  if (!exists) {
    return next(new Error(`El juego con slug "${this.gameSlug}" no existe`));
  }
  next();
});

export const ReviewSchema = reviewSchema;
export default mongoose.model("Review", ReviewSchema);
