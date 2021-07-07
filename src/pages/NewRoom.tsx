import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link, useHistory } from 'react-router-dom'
import illustrationsImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../assets/styles/auth.scss'
import { Button } from '../components/Button';
import { database } from '../services/firebase';

export function NewRoom() {
  const { user } = useAuth()
  const [newRoom, setnewRoom] = useState('')
  const history = useHistory();

  async function handleCreateRom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return
    }

    const roomref = database.ref('rooms')

    const firebaseRom = await roomref.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRom.key}`)

  }

  console.log(user)
  return (
    <div id="page-auth">
      < aside >
        <img src={illustrationsImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp; A ao-vivo</strong>
        <p> Tire as dúvidas da sua audiência em tempo-real</p>
      </aside >

      <main>

        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={event => setnewRoom(event.target.value)}
            />
            <Button type="submit">
              Criar Sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>

      </main>
    </div >
  )
}