import { pintarEventos } from '../Home/Home'
import './Inscritos.css'

export const Inscritos = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const user = JSON.parse(localStorage.getItem('user'))

  const res = await fetch(`http://localhost:3000/api/v1/users/${user._id}`)

  const usuario = await res.json()

  pintarEventos(usuario.inscritos, main)
}
