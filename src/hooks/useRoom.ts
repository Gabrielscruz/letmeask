import { useState, useEffect } from 'react'
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth'

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  Likes: Record<string, {
    authorId: string,
  }>
}>


type Questions = {
  id: string;
  author: {
    name: string,
    avatar: string
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeid: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [Questions, setQuestions] = useState<Questions[]>([])
  const [Title, SetTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const FirebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(FirebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.Likes ?? {}).length,
          likeid: Object.entries(value.Likes ?? {}).find(([key, Like]) => Like.authorId === user?.id)?.[0]
        }

      })
      SetTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

    })
    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return { Questions, Title }
}