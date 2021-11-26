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