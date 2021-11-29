import { ISpotifyArtist, ISpotifyTrack } from "./spotifyApi";

export interface IUser {
  token: string
  email: string
  displayName: string
  displayPicture?: string
  topTracks?: ISpotifyTrack[]
  topArtists?: ISpotifyArtist[]
}