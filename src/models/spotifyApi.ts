export interface ISpotifyTrack {
  albumImageUrl: string
  albumName: string
  releaseDate: string
  artists: string[]
  name: string
  popularity: number
  previewUrl: string
}

export interface ISpotifyArtist {
  followers: number
  genres: string[]
  imageUrl: string
  name: string
  popularity: number
}
export enum SpotifyTopItems {
  tracks = 'tracks',
  artists = 'artists',
}
export enum SpotifyTopRange {
  shortTerm = 'short_term',
  mediumTerm = 'medium_term',
  longtTerm = 'long_term',
}