const { isAuth } = require('../../middlewares/auth')
const {
  getEventos,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento,
  addAsistente,
  removeAsistente
} = require('../controllers/evento')

const eventosRouter = require('express').Router()

eventosRouter.get('/', getEventos)
eventosRouter.get('/:id', getEventoById)
eventosRouter.post('/', isAuth, postEvento)
eventosRouter.put('/:id', isAuth, updateEvento)
eventosRouter.delete('/:id', isAuth, deleteEvento)
eventosRouter.post('/addAsistente/:eventoId', addAsistente)
eventosRouter.post('/removeAsistente/:eventoId', removeAsistente)

module.exports = eventosRouter
