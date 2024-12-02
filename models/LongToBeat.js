import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LongToBeatSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  all_playstyles: { type: Number },
  completionists: { type: Number },
  with_extras: { type: Number },
  main_story: { type: Number },
});

export default mongoose.model("LongToBeat", LongToBeatSchema);
