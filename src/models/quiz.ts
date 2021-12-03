import { ISpotifyTrack } from "./spotifyApi";

export interface IQuiz {
  ts: number
  questions: IQuestion[]
  responses: IQuizResponse[]
}
export interface IQuestion {
  id: string
  track: ISpotifyTrack
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