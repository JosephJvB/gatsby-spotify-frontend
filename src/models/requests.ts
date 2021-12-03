import { IQuestion } from "./quiz";
import { SpotifyTopItems, SpotifyTopRange } from "./spotifyApi";

export interface ILoginRequestData {
  email: string
  password: string
}
export interface IRegisterRequestData {
  email: string
  password: string
  passwordConfirm: string
  spotifyCode: string
}
export interface ITokenRequest {
  token: string
}
export interface ITopItemsRequest {
  token: string
  type: SpotifyTopItems
  range?: SpotifyTopRange
  limit?: number
}
export interface ISubmitQuizRequest {
  token: string
  answers: IQuestion[]
}