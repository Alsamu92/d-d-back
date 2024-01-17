const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema(
  {
    jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    jugadorName:[{type : String}],
    personaje: [{ type: String }],
    oro: [
      {
        type: String,
      },
    ],
    salud: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
