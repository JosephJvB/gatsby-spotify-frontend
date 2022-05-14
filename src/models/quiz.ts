import { ISpotifyTrack } from "./spotifyApi";

export enum QuizType {
  track = 'track',
}

export interface IQuiz {
  guid: string
  quizId: string
  quizType: string
  questions: IQuestion[]
}
export interface IQuestion {
  id: string
  subject: ISpotifyTrack
  choices: IQuizProfile[]
  answer: IQuizProfile
}
export interface IQuizProfile {
  spotifyId: string
  spotifyDisplayName: string
  spotifyDisplayPicture: string
}
export interface IQuizResponse {
  spotifyId: string
  answers: IQuestion[]
  score: number
}