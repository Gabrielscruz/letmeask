import { useParams } from 'react-router-dom'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { useRoom } from '../hooks/useRoom'
import { useHistory } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import '../assets/styles/room.scss';
import { RoomCode } from '../components/Roomcode'
import { Question } from '../components/Question'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { Title, Questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleCheckQuestionAsAnswerd(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem centeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <div>
            <RoomCode code={params.id} />
            <Button
              isOutlined
              onClick={() => handleEndRoom()}
            >Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {Title}</h1>
          {Questions.length > 0 && <span>{Questions.length} pergunta(s)</span>}
        </div>

        <div className="questions-list">
          {Questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                    <>
                      <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswerd(question.id)}
                      >
                          <img src={checkImg} alt="Marcar perguntar como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighLightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                )}

               

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="deletando questao" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}