import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SalesSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  na_sales: { type: Number },
  eu_sales: { type: Number },
  jp_sales: { type: Number },
  other_sales: { type: Number },
  global_sales: { type: Number },
});

export default mongoose.model("Sales", SalesSchema);
