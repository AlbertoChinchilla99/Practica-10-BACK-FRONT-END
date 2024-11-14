const Evento = require('../models/evento')

const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find().populate('asistentes', 'userName') // Aquí haces populate
    return res.status(200).json(eventos)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const getEventoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findById(id).populate('asistentes', 'userName')
    return res.status(200).json(evento)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const postEvento = async (req, res, next) => {
  try {
    const newEvento = new Evento(req.body)
    const evento = await newEvento.save()
    return res.status(201).json(evento)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const updateEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    const newEvento = new Evento(req.body)
    newEvento._id = id
    const eventoUpdated = await Evento.findByIdAndUpdate(id, newEvento, {
      new: true
    })
    return res.status(200).json(eventoUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const deleteEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Ha sido eliminado con éxito',
      eventoEliminado: evento
    })
  } catch (error) {
    return res.status(400).json('error')
  }
}
const addAsistente = async (req, res) => {
  const { eventoId } = req.params
  const { userId } = req.body

  try {
    const evento = await Evento.findById(eventoId)
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    if (!evento.asistentes.includes(userId)) {
      evento.asistentes.push(userId)
      await evento.save()
      return res.status(200).json({ message: 'Asistente agregado', evento })
    } else {
      return res.status(400).json({ message: 'El usuario ya está inscrito' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error al agregar asistente', error })
  }
}

const removeAsistente = async (req, res) => {
  const { eventoId } = req.params
  const { userId } = req.body

  try {
    const evento = await Evento.findById(eventoId)
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    const index = evento.asistentes.indexOf(userId)
    if (index !== -1) {
      evento.asistentes.splice(index, 1)
      await evento.save()
      return res.status(200).json({ message: 'Asistente eliminado', evento })
    } else {
      return res
        .status(400)
        .json({ message: 'El usuario no está inscrito en este evento' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error al eliminar asistente', error })
  }
}
module.exports = {
  getEventos,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento,
  addAsistente,
  removeAsistente
}
