const mongoose = require("mongoose");

const farmAnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Cow', 'Goat', 'Pig', 'Chicken']
  },
  birthDate: {
    type: Date
  },
  weight: {
    type: Number
  },
  notes: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('FarmAnimal', farmAnimalSchema);
