import { Header } from '../../components/Header'
import { Home } from '../Home/Home'
import './Register.css'

export const Registrarse = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const registroDiv = document.createElement('div')
  Registro(registroDiv)
  registroDiv.id = 'registro'

  main.append(registroDiv)
}

const Registro = (elementoPadre) => {
  const form = document.createElement('form')

  const inputUN = document.createElement('input')
  const inputEmail = document.createElement('input')
  const inputPass = document.createElement('input')
  const button = document.createElement('button')

  inputUN.placeholder = 'User Name'
  inputEmail.placeholder = 'Email'
  inputPass.placeholder = '*****'
  inputPass.type = 'password'
  button.textContent = 'Register'

  form.append(inputUN, inputEmail, inputPass, button)
  elementoPadre.append(form)

  form.addEventListener('submit', (event) => {
    event.preventDefault() // Evita que se recargue la página
    submitRegistro(inputUN.value, inputEmail.value, inputPass.value, form)
  })
}

const submitRegistro = async (userName, email, password, form) => {
  const objetoFinal = JSON.stringify({
    userName,
    email,
    password
  })

  const opciones = {
    method: 'POST',
    body: objetoFinal,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const res = await fetch(
    'http://localhost:3000/api/v1/users/register',
    opciones
  )

  // Eliminamos el mensaje de error anterior si existe
  const pError = document.querySelector('.error')
  if (pError) {
    pError.remove()
  }

  // Si la respuesta es un error, lo mostramos en el formulario
  if (res.status === 400) {
    const errorData = await res.json()
    const pError = document.createElement('p')
    pError.classList.add('error')
    pError.style.color = 'red'

    // Comprobamos el tipo de error y mostramos un mensaje específico
    if (errorData.error === 'Usuario ya existente') {
      pError.textContent = 'El nombre de usuario ya está registrado.'
    } else if (errorData.error === 'Correo electrónico inválido') {
      pError.textContent = 'El correo electrónico ingresado no es válido.'
    } else {
      pError.textContent = 'Registro fallido: revisa los datos ingresados'
    }

    form.append(pError)
    return
  }

  const respuestaFinal = await res.json()

  // Guardamos el token y el usuario en localStorage
  localStorage.setItem('token', respuestaFinal.token)
  localStorage.setItem('user', JSON.stringify(respuestaFinal.user))

  // Redirigimos a la página principal
  Home()
  Header()
}
