import './Home.css'

/* URL de la API de eventos */
export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = '' // Limpiamos el contenedor principal

  try {
    const res = await fetch('http://localhost:3000/api/v1/eventos')
    const eventos = await res.json()
    pintarEventos(eventos, main)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
  }
}

// Función para pintar los eventos en el HTML
export const pintarEventos = (eventos, elementoPadre) => {
  const divEventos = document.createElement('div')
  divEventos.className = 'eventos'

  // Comprobamos si el usuario está logueado
  const user = JSON.parse(localStorage.getItem('user'))

  for (const evento of eventos) {
    const divEvento = document.createElement('div')
    const titulo = document.createElement('h3')
    const poster = document.createElement('img')
    const info = document.createElement('div')
    const asistentes = document.createElement('p')
    const like = document.createElement('img')
    like.className = 'like'

    // Verificamos si el usuario está logueado antes de añadir el botón de "like"
    if (user) {
      like.addEventListener('click', () => {
        console.log('Like clicked for evento ID:', evento._id)
        addAsistente(evento._id)
      })

      // Cambiamos el icono dependiendo si el usuario ya está inscrito
      if (user?.inscritos?.includes(evento._id)) {
        like.src = './relleno-like.png'
      } else {
        like.src = '/public/like.png'
      }
    } else {
      // Si el usuario no está logueado, mostramos un icono gris desactivado
      like.src = '/public/like-disabled.png' // Icono de "like" desactivado
      like.style.cursor = 'not-allowed'
      like.title = 'Debes iniciar sesión para dar like'
    }

    // Añadimos la información del evento
    divEvento.className = 'evento'
    titulo.textContent = evento.titulo
    poster.src = evento.poster
    asistentes.textContent = `${evento.asistentes.length} asistentes`

    // Se muestra "info" que es el autor, pero no "descripcion"
    info.innerHTML = `<p>${evento.autor}</p>` // Info es autor

    // Añadimos el botón de like solo si el usuario está logueado
    if (user) {
      divEvento.append(titulo, poster, asistentes, info, like) // No añadimos la descripcion
    } else {
      divEvento.append(titulo, poster, asistentes, info) // No añadimos la descripcion
    }

    // Hacemos el click en la imagen para mostrar el modal con más información
    poster.addEventListener('click', () => mostrarModal(evento))

    divEventos.append(divEvento)
  }

  elementoPadre.append(divEventos)
}

// Función para agregar un evento al usuario como inscrito
// Función de inscripción (añadir asistente)
// Función para agregar un evento al usuario como inscrito
const addAsistente = async (eventoId) => {
  const user = JSON.parse(localStorage.getItem('user')) // Obtener usuario logueado
  if (!user) {
    alert('Debes iniciar sesión para inscribirte en un evento')
    window.location.href = '/login' // Redirigir a login si no está logueado
    return
  }

  const objetoFinal = JSON.stringify({
    userId: user._id // Enviamos el ID del usuario
  })

  const opciones = {
    method: 'POST', // O 'PUT' si tu backend usa ese verbo para agregar
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: objetoFinal
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/eventos/addAsistente/${eventoId}`,
      opciones
    )

    if (res.ok) {
      const respuesta = await res.json()
      console.log('Inscripción exitosa:', respuesta)
      Home() // Actualizamos la lista de eventos para reflejar el cambio
    } else {
      console.error('Error al inscribirse:', res.status)
    }
  } catch (error) {
    console.error('Error en la solicitud de inscripción:', error)
  }
}

// Función para eliminar un evento del usuario como inscrito
const removeAsistente = async (req, res) => {
  try {
    const { eventoId } = req.params // Obtener el ID del evento desde los parámetros de la URL
    const { userId } = req.body // Obtener el ID del usuario desde el cuerpo de la solicitud

    // Buscar el evento y el usuario en la base de datos
    const evento = await Evento.findById(eventoId)
    const usuario = await Usuario.findById(userId)

    // Verificar si el evento existe
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Verificar si el usuario está inscrito en el evento
    const indexAsistente = evento.asistentes.indexOf(userId)
    if (indexAsistente === -1) {
      return res
        .status(400)
        .json({ message: 'El usuario no está inscrito en este evento' })
    }

    // Eliminar al usuario de la lista de asistentes del evento
    evento.asistentes.splice(indexAsistente, 1)
    await evento.save() // Guardamos los cambios en el evento

    // Eliminar el evento de la lista de eventos inscritos del usuario
    const indexEvento = usuario.inscritos.indexOf(eventoId)
    if (indexEvento !== -1) {
      usuario.inscritos.splice(indexEvento, 1)
      await usuario.save() // Guardamos los cambios en el usuario
    }

    // Respondemos con éxito
    return res
      .status(200)
      .json({ message: 'Usuario desinscrito con éxito', evento })
  } catch (error) {
    console.error('Error al eliminar asistente:', error)
    return res
      .status(500)
      .json({ message: 'Error interno del servidor', error: error.message })
  }
}

// Mostrar el modal con la información completa del evento
const mostrarModal = (evento) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    alert('Debes iniciar sesión para ver más detalles del evento')
    window.location.href = '/login' // Redirige al login
    return
  }

  const modal = document.createElement('div')
  modal.className = 'modal'

  const modalContent = document.createElement('div')
  modalContent.className = 'modal-content'

  const closeModal = document.createElement('span')
  closeModal.className = 'close'
  closeModal.textContent = '×'
  closeModal.addEventListener('click', () => modal.remove())

  const titulo = document.createElement('h2')
  titulo.textContent = evento.titulo

  const poster = document.createElement('img')
  poster.src = evento.poster
  poster.className = 'modal-poster'

  const descripcion = document.createElement('p')
  descripcion.textContent = evento.descripcion

  const asistentes = document.createElement('p')
  asistentes.innerHTML = `Asistentes: ${evento.asistentes
    .map((a) => a.nombre)
    .join(', ')}`

  modalContent.append(closeModal, titulo, poster, descripcion, asistentes)
  modal.append(modalContent)

  document.body.append(modal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}
