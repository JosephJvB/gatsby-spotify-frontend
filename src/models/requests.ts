import { IQuestion, IQuizResponse, QuizType } from "./quiz";
import { SpotifyTopItems, SpotifyTopRange } from "./spotifyApi";

export interface ITokenequest {
  token: string | null
}
export interface ITopItemsRequest {
  token: string | null
  type: SpotifyTopItems
  range: SpotifyTopRange
  limit?: number
}
export interface ISubmitQuizRequest {
  token: string | null
  quizType: string
  quizId: string
  answers: IQuestion[]
}
export interface IGenerateQuizRequest {
  token: string | null
  spotifyId: string
  quizType: QuizType
}

export interface IGetQuizRequest {
  token: string | null
  quizType: QuizType
  quizId: string
}

export interface ILoadUsersRequest {
  token: string | null
  spotifyId: string
}