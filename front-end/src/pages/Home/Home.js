import './Home.css'

export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  try {
    const res = await fetch('http://localhost:3000/api/v1/eventos')
    const eventos = await res.json()
    pintarEventos(eventos, main)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
  }
}

export const pintarEventos = (eventos, elementoPadre) => {
  const divEventos = document.createElement('div')
  divEventos.className = 'eventos'

  const user = JSON.parse(localStorage.getItem('user'))

  for (const evento of eventos) {
    const divEvento = document.createElement('div')
    const titulo = document.createElement('h3')
    const poster = document.createElement('img')
    const info = document.createElement('div')
    const asistentes = document.createElement('p')
    const like = document.createElement('img')
    like.className = 'like'

    if (user) {
      like.addEventListener('click', async () => {
        localStorage.setItem('evento', JSON.stringify(evento))
        await addAsistente(user._id, evento._id)
        await addEvento(user._id, evento._id)
      })

      if (user.inscritos?.includes(evento._id)) {
        like.src = './relleno-like.png'
      } else {
        like.src = './like.png'
      }
    }

    divEvento.className = 'evento'
    titulo.textContent = evento.titulo
    poster.src = evento.poster
    asistentes.textContent = `${evento.asistentes.length} asistentes`

    info.innerHTML = `<p>${evento.autor}</p>`

    if (user) {
      divEvento.append(titulo, poster, asistentes, info, like)
    } else {
      divEvento.append(titulo, poster, asistentes, info)
    }

    poster.addEventListener('click', () => mostrarModal(evento))

    divEventos.append(divEvento)
  }

  elementoPadre.append(divEventos)
}

const addAsistente = async (userId, eventoId) => {
  try {
    const evento = JSON.parse(localStorage.getItem('evento'))

    if (!evento.asistentes.includes(userId)) {
      evento.asistentes.push(userId)
    }

    const objetoFinal = JSON.stringify({
      asistentes: evento.asistentes
    })

    const opciones = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: objetoFinal
    }

    const respuesta = await fetch(
      `http://localhost:3000/api/v1/eventos/${eventoId}`,
      opciones
    )

    if (!respuesta.ok) {
      console.error('Error al actualizar los asistentes del evento')
      return
    }

    console.log(
      `Usuario ${userId} añadido a los asistentes del evento ${eventoId}`
    )
  } catch (error) {
    console.error('Error al agregar asistente:', error)
  }
}

const addEvento = async (userId, eventoId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user.inscritos.includes(eventoId)) {
      user.inscritos = [...user.inscritos, eventoId]
    }

    const objetoFinal = JSON.stringify({
      inscritos: user.inscritos
    })

    const opciones = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: objetoFinal
    }

    const respuesta = await fetch(
      `http://localhost:3000/api/v1/users/${userId}`,
      opciones
    )

    if (!respuesta.ok) {
      console.error('Error al actualizar los inscritos del usuario')
      return
    }

    const updatedUser = await respuesta.json()
    localStorage.setItem('user', JSON.stringify(updatedUser))

    console.log(
      `Evento ${eventoId} añadido a los inscritos del usuario ${userId}`
    )
  } catch (error) {
    console.error('Error al agregar evento al usuario:', error)
  }
  Home()
}

const mostrarModal = (evento) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    alert('Debes iniciar sesión para ver más detalles del evento')
    window.location.href = '/login'
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
