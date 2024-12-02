import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  username: { type: String },
  review_text: { type: String },
  review_score: { type: Number, required: true },
  review_votes: { type: Number },
  hours_played: { type: Number },
  recommendation: { type: Boolean },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Review", ReviewSchema);
