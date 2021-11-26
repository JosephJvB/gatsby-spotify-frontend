export interface ISpotifyTrack {
  album: ISpotifyAlbum
  artists: ISpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: { [key: string]: string }
  external_urls: {
    spotify: string
    [key: string]: string
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface ISpotifyAlbum {
  album_type: string
  artists: ISpotifyArtist[]
  images: ISpotifyImage[]
  name: string
  releast_date: string
}
export interface ISpotifyArtist {
  name: string
  uri: string
}
export interface ISpotifyImage {
  height?: number
  url: string
  width?: number
}