import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"
import { ISpotifyArtist, ISpotifyTrack, SpotifyTopItems } from "../models/spotifyApi"

class SpotifyService {
  http: HttpClient
  topTracks: ISpotifyTrack[]
  topArtists: ISpotifyArtist[]
  constructor() {
    this.http = new HttpClient()
  }
  async getTopItems(type: SpotifyTopItems): Promise<void> {
    const { token, items } = await this.http.getTopItems({
      token: localStorage.getItem(JafToken),
      type
    })
    localStorage.setItem(JafToken, token)
    switch (type) {
      case SpotifyTopItems.artists:
        this.topArtists = items as ISpotifyArtist[]
        break
      case SpotifyTopItems.tracks:
        this.topTracks = items as ISpotifyTrack[]
        break
    }
  }
}

export default new SpotifyService()