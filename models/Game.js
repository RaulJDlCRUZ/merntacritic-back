import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
  genre: [{ type: String }],
  publisher: [{ type: String }],
  developer: { type: [String] },
  release_date: { type: Date, required: true },
  esrb_rating: { type: String },
  price: { type: Number },
  discounted_price: { type: Number },
  metascore: { type: Number },
  user_score: { type: Number },
  website: { type: String },
  description: { type: String },
  supported_languages: [{ type: String }],
  game_features: [{ type: String }],
  steam_tags: [{ type: String }],
  achievements: { type: Number },
  reviews_count: { type: Number },
  rating_top: { type: Number },
});

export default mongoose.model("Game", GameSchema);
