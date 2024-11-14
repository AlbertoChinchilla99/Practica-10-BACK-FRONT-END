import { Header } from '../../components/Header'
import { Home } from '../Home/Home'
import './Upload.css'

export const CrearEvento = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const eventoDiv = document.createElement('div')
  FormularioEvento(eventoDiv)
  eventoDiv.id = 'crear-evento'

  main.append(eventoDiv)
}

const FormularioEvento = (elementoPadre) => {
  const form = document.createElement('form')

  // Crear los inputs
  const inputTitulo = document.createElement('input')
  const inputPoster = document.createElement('input')
  const inputFecha = document.createElement('input')
  const inputDescripcion = document.createElement('textarea')
  const inputAutor = document.createElement('input')
  const button = document.createElement('button')

  // Atributos y placeholders para los inputs
  inputTitulo.placeholder = 'Título del Evento'
  inputPoster.placeholder = 'URL del Poster'
  inputFecha.type = 'date'
  inputFecha.placeholder = 'Fecha del Evento'
  inputDescripcion.placeholder = 'Descripción del Evento'
  inputAutor.placeholder = 'Autor del Evento'
  button.textContent = 'Crear Evento'

  // Agregar los inputs al formulario
  form.append(
    inputTitulo,
    inputPoster,
    inputFecha,
    inputDescripcion,
    inputAutor,
    button
  )
  elementoPadre.append(form)

  // Manejador del formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault() // Evita que se recargue la página
    submitEvento(
      inputTitulo.value,
      inputPoster.value,
      inputFecha.value,
      inputDescripcion.value,
      inputAutor.value,
      form
    )
  })
}

const submitEvento = async (
  titulo,
  poster,
  fecha,
  descripcion,
  autor,
  form
) => {
  // Crear el objeto final con los datos del evento
  const objetoFinal = JSON.stringify({
    titulo,
    poster,
    fecha,
    descripcion,
    autor
  })

  // Opciones del fetch
  const opciones = {
    method: 'POST',
    body: objetoFinal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}` // Añadir autorización si el usuario está logueado
    }
  }

  // Petición para crear el evento
  const res = await fetch('http://localhost:3000/api/v1/eventos', opciones)

  if (res.status === 400) {
    // Mostrar error si falla la petición
    const pError = document.createElement('p')
    pError.classList.add('error')
    pError.textContent = 'Error al crear el evento: revisa los datos ingresados'
    pError.style.color = 'red'
    form.append(pError)
    return
  }

  // Remover el mensaje de error si se corrige el formulario
  const pError = document.querySelector('.error')
  if (pError) {
    pError.remove()
  }

  // Obtener la respuesta y redirigir al Home
  const respuestaFinal = await res.json()

  alert('Evento creado con éxito!')
  Home()
  Header()
}
