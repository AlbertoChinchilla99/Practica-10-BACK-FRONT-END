import { Header } from '../../components/Header'
import { Home } from '../Home/Home'
import './Login.css'

export const Iniciarsesion = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const loginDiv = document.createElement('div')

  Login(loginDiv)

  loginDiv.id = 'login'

  main.append(loginDiv)
}

const Login = (elementoPadre) => {
  const form = document.createElement('form')

  const inputUN = document.createElement('input')
  const inputPass = document.createElement('input')
  const button = document.createElement('button')

  inputPass.type = 'password'
  inputUN.placeholder = 'User Name'
  inputPass.placeholder = '*****'
  button.textContent = 'Login'

  elementoPadre.append(form)
  form.append(inputUN)
  form.append(inputPass)
  form.append(button)

  form.addEventListener('submit', (event) => {
    event.preventDefault() // Prevenir el comportamiento predeterminado de la forma (recarga)
    submit(inputUN.value, inputPass.value, form)
  })
}

const submit = async (userName, password, form) => {
  const objetoFinal = JSON.stringify({
    userName,
    password
  })

  const opciones = {
    method: 'POST',
    body: objetoFinal,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const res = await fetch('http://localhost:3000/api/v1/users/login', opciones)

  // Eliminamos cualquier mensaje de error previo si existe
  const pError = document.querySelector('.error')
  if (pError) {
    pError.remove()
  }

  // Si la respuesta es un error (status 400), mostramos el mensaje de error correspondiente
  if (res.status === 400) {
    const pError = document.createElement('p')
    pError.classList.add('error')
    pError.style.color = 'red'

    // Error específico si el usuario o la contraseña son incorrectos
    pError.textContent = 'Usuario o contraseña incorrectos'

    form.append(pError)
    return
  }

  // Si el login fue exitoso, limpiamos cualquier mensaje de error anterior
  const respuestaFinal = await res.json()

  // Guardamos el token y el usuario en el localStorage
  localStorage.setItem('token', respuestaFinal.token)
  localStorage.setItem('user', JSON.stringify(respuestaFinal.user))

  // Redirigimos a la página principal
  Home()
  Header()
}
