import { ISpotifyTrack } from "./spotifyApi";
import { IUser } from "./user";

export interface ITokenResponse {
  token: string
}

export interface IAuthResponse extends IUser {
  message: string
}

export interface ITopTrackResponse {
  message: string
  tracks: ISpotifyTrack[]
}