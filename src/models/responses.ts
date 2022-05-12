import { IQuiz } from "./quiz";
import { ISpotifyArtist, ISpotifyTrack } from "./spotifyApi";
import { IUser } from "./user";

export interface ITokenResponse {
  token: string
}

export interface IAuthResponse extends IUser {
  message: string
  token: string
}
export interface IAuthSessionResponse extends IUser {
  message: string
  token: string
  sessionToken?: string
}

export interface ITopItemsResponse {
  message?: string
  token: string
  items: (ISpotifyTrack | ISpotifyArtist)[]
}
export interface IQuizResponse {
  message?: string
  token: string
  quiz: IQuiz
  answered: boolean
}