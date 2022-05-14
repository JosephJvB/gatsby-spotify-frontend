import { IQuestion, QuizType } from "./quiz";
import { SpotifyTopItems, SpotifyTopRange } from "./spotifyApi";

export interface ITokenRequest {
  token: string
}
export interface ITopItemsRequest {
  token: string
  type: SpotifyTopItems
  range: SpotifyTopRange
  limit?: number
}
export interface ISubmitQuizRequest {
  token: string
  answers: IQuestion[]
}
export interface IGenerateQuizRequest {
  token: string
  spotifyId: string
  quizType: QuizType
}

export interface IGetQuizRequest {
  token: string
  quizType: QuizType
  quizId: string
}