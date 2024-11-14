const { generarLlave } = require('../../utils/jwt')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('inscritos')
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('inscritos')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body

    // Verificar si el nombre de usuario ya existe
    const userDuplicated = await User.findOne({ userName })
    if (userDuplicated) {
      return res.status(400).json({ error: 'Usuario ya existente' })
    }

    // Verificar si el email tiene un formato válido
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' })
    }

    // Crear el nuevo usuario
    const newUser = new User({
      userName,
      email,
      password,
      rol: 'user'
    })

    // Encriptar la contraseña antes de guardarla
    newUser.password = bcrypt.hashSync(password, 10)

    const user = await newUser.save()
    return res.status(201).json({ token: generarLlave(user._id), user })
  } catch (error) {
    return res.status(400).json({ error: 'Error al registrar el usuario' })
  }
}

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body

    const user = await User.findOne({ userName })

    if (!user) {
      return res.status(400).json('Usuario o contraseña incorrectos')
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generarLlave(user._id)
      return res.status(200).json({ token, user })
    }

    return res.status(400).json('Usuario o contraseña incorrectos')
  } catch (error) {
    return res.status(400).json('error')
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user._id.toString() !== id) {
      return res
        .status(400)
        .json('No puedes modificar a alguien que no seas tú mismo')
    }

    const oldUser = await User.findById(id)
    const newUser = new User(req.body)
    newUser._id = id

    // Añadimos nuevos eventos al array, asegurándonos de que no haya duplicados
    newUser.inscritos = [
      ...new Set([...oldUser.inscritos, ...newUser.inscritos])
    ]

    const userUpdated = await User.findByIdAndUpdate(id, newUser, {
      new: true
    })

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  login
}
