import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { database } from '../services/firebase';
import illustrationsImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../assets/styles/auth.scss'
import { Button } from '../components/Button';



export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth()
  const [RoomCode, SetRoomCode] = useState('')

  async function handleCreateRom() {
    if (!user) {
      await signInWithGoogle()
    }
    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (RoomCode.trim() === '') {
      return;
    }
    const roomRef = await database.ref(`rooms/${RoomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }
    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${RoomCode}`)
  }
  // 43:57
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
          <button onClick={handleCreateRom} className="create-room">
            <img src={googleIconImg} alt="logo do google" />
            Crie sua sala com o Google

          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={RoomCode}
              onChange={event => SetRoomCode(event.target.value)}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div >
  )
}