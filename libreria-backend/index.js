require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { connectDB } = require('./src/config/db')
const eventosRouter = require('./src/api/routes/evento')
const usersRouter = require('./src/api/routes/user')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

connectDB()

app.use('/api/v1/eventos', eventosRouter)
app.use('/api/v1/users', usersRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

app.listen(3000, () => {
  console.log('Servidor levantado en: http://localhost:3000 🤩')
})
