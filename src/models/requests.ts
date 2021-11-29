import { SpotifyTopItems, SpotifyTopRange } from "./spotifyApi";

export interface LoginRequestData {
  email: string
  password: string
}
export interface RegisterRequestData {
  email: string
  password: string
  passwordConfirm: string
  spotifyCode: string
}
export interface TokenRequest {
  token: string
}
export interface ITopItemsRequest {
  token: string
  type: SpotifyTopItems
  range?: SpotifyTopRange
  limit?: number
}