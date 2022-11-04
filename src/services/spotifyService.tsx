import { IAudioFeatures, ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"

export default class SpotifyService {
  http: HttpClient
  topTracksMap: {
    [timeRange: string]: ISpotifyTrack[]
  } = {}
  topArtistsMap: {
    [timeRange: string]: ISpotifyArtist[]
  } = {}
  audioFeaturesMap: {
    [timeRange: string]: IAudioFeatures[]
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
  async getAudioFeatures(range: SpotifyTopRange): Promise<void> {
    const trackIds = this.topTracksMap[range].map(t => t.id)
    const { token, audioFeatures } = await this.http.getAudioFeatures({
      token: localStorage.getItem(JafToken)!,
      trackIds,
    })
    localStorage.setItem(JafToken, token)
    this.audioFeaturesMap[range] = audioFeatures
  }
}
