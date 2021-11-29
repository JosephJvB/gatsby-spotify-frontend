import { ISpotifyArtist, ISpotifyTrack } from "./spotifyApi";
import { IUser } from "./user";

export interface ITokenResponse {
  token: string
}

export interface IAuthResponse extends IUser {
  message: string
}

export interface ITopItemsResponse {
  message?: string
  token: string
  items: (ISpotifyTrack | ISpotifyArtist)[]
}