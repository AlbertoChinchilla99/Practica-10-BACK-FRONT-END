import { Inscritos } from '../pages/Inscritos/Inscritos'
import { Home } from '../pages/Home/Home'
import { Iniciarsesion } from '../pages/Login/Login'
import { Registrarse } from '../pages/Register/Register'
import { CrearEvento } from '../pages/Upload/Upload'
import './Header.css'

const routes = [
  {
    texto: 'Home',
    funcion: Home
  },
  {
    texto: 'Inscritos',
    funcion: Inscritos
  },
  {
    texto: 'Crear evento',
    funcion: CrearEvento
  },
  {
    texto: 'Login',
    funcion: Iniciarsesion
  },
  {
    texto: 'Sign Up',
    funcion: Registrarse
  }
]

export const Header = () => {
  const header = document.querySelector('header')
  header.innerHTML = ''
  const nav = document.createElement('nav')

  for (const route of routes) {
    const a = document.createElement('a')
    a.href = '#'

    // Ocultar opciones según el estado de autenticación
    if (route.texto === 'Login' && localStorage.getItem('token')) {
      // Cambiar "Login" a "Logout" si el usuario está autenticado
      a.textContent = 'Logout'
      a.addEventListener('click', () => {
        localStorage.clear()
        Header() // Recargar el Header para actualizar opciones
        Home() //Recarga la pagina para actualizar favoritos
      })
    } else if (
      (route.texto === 'Sign Up' && localStorage.getItem('token')) ||
      (route.texto === 'Crear evento' && !localStorage.getItem('token'))
    ) {
      // Ocultar "Sign Up" si el usuario está autenticado
      // Ocultar "Crear evento" si el usuario NO está autenticado
      continue
    } else {
      if (!localStorage.getItem('token') && route.texto === 'Inscritos') {
        // Ocultar "Inscritos" si el usuario NO está autenticado
        continue
      } else {
        a.textContent = route.texto
        a.addEventListener('click', route.funcion)
      }
    }

    nav.append(a)
  }

  header.append(nav)
}
