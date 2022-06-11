import { IQuiz, IQuizResponse } from "./quiz";
import { ISpotifyArtist, ISpotifyTrack } from "./spotifyApi";
import { IUser } from "./user";

export interface IAuthResponse extends IUser {
  message: string
  token: string
}
export interface IAuthSessionResponse extends IUser {
  message: string
  token: string
}

export interface ITopItemsResponse {
  message?: string
  token: string
  items: (ISpotifyTrack | ISpotifyArtist)[]
}
export interface ILoadQuizResponse {
  message?: string
  token: string
  quiz: IQuiz
  quizResponse: IQuizResponse
}

export interface ILoadUsersResponse {
  message?: string
  token: string
  users: IUser[]
}