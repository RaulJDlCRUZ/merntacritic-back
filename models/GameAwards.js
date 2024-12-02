const GameAwardsSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  winner: { type: Boolean, required: true },
});
