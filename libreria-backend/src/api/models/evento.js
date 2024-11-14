const mongoose = require('mongoose')

const eventoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    poster: { type: String, required: true },
    asistentes: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'users' }
    ],
    fecha: { type: Date, required: true },
    descripcion: { type: String, required: true },
    autor: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
)

const Evento = mongoose.model('eventos', eventoSchema, 'eventos')
module.exports = Evento
