import { ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"

export default class SpotifyService {
  http: HttpClient
  topTracksMap: {
    [key: string]: ISpotifyTrack[]
  } = {}
  topArtistsMap: {
    [key: string]: ISpotifyArtist[]
  } = {}
  constructor(http: HttpClient) {
    this.http = http
  }
  async getTopItems(type: SpotifyItemType, range: SpotifyTopRange): Promise<void> {
    const { token, items } = await this.http.getTopItems({
      token: localStorage.getItem(JafToken)!,
      type,
      range
    })
    localStorage.setItem(JafToken, token)
    switch (type) {
      case SpotifyItemType.artists:
        this.topArtistsMap[range] = items as ISpotifyArtist[]
        break
      case SpotifyItemType.tracks:
        this.topTracksMap[range] = items as ISpotifyTrack[]
        break
    }
  }
}
