import { IQuestion, IQuizResponse, QuizType } from "./quiz";
import { SpotifyItemType, SpotifyTopRange } from 'jvb-spotty-models'

export interface ITokenRequest {
  token: string
}
export interface ITopItemsRequest {
  token: string
  type: SpotifyItemType
  range: SpotifyTopRange
  limit?: number
}
export interface ISubmitQuizRequest {
  token: string
  quizType: string
  quizId: string
  answers: IQuestion[]
}
export interface IGenerateQuizRequest {
  token: string
  quizType: QuizType
  userIds: string[]
}

export interface IGetQuizRequest {
  token: string
  quizType: QuizType
  quizId: string
}

export interface ILoadUsersRequest {
  token: string
  spotifyId: string
}