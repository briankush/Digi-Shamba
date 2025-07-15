const mongoose = require("mongoose");

const farmAnimalSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., Cow, Goat, Chicken, Pig
  name: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  weight: { type: Number },
  notes: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
}, { timestamps: true });

module.exports = mongoose.model("FarmAnimal", farmAnimalSchema);
