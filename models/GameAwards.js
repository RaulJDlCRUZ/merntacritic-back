const GameAwardsSchema = new Schema({
  year: { type: Number, required: true },
  category: { type: String, required: true },
  game: { type: String, required: true },
  studio: { type: String, required: true },
  winner: { type: Boolean, required: true },
});
