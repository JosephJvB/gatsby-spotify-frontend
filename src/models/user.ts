import { ISpotifyArtist, ISpotifyTrack } from "./spotifyApi";

export interface IUser {
  email: string
  spotifyId: string
  displayName: string
  displayPicture?: string
}