const mongoose = require('mongoose');

// Schema for individual animals
const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  weight: { type: Number },
  dateAdded: { type: Date, default: Date.now },
  notes: { type: String }
});

// Main farm schema that references the farmer and contains animal collections
const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cows: [animalSchema],
  goats: [animalSchema],
  pigs: [animalSchema],
  chickens: [animalSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to update the updatedAt field
farmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farm', farmSchema);