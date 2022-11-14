import { IAudioFeatures, ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"


export default class SpotifyService {
  http: HttpClient
  topTracksMap: {
    [timeRange: string]: ISpotifyTrack[]
  } = {
    [SpotifyTopRange.shortTerm]: [],
    [SpotifyTopRange.mediumTerm]: [],
    [SpotifyTopRange.longTerm]: [],
  }
  topArtistsMap: {
    [timeRange: string]: ISpotifyArtist[]
  } = {
    [SpotifyTopRange.shortTerm]: [],
    [SpotifyTopRange.mediumTerm]: [],
    [SpotifyTopRange.longTerm]: [],
  }
  audioFeaturesMap: {
    [timeRange: string]: IAudioFeatures[]
  } = {
    [SpotifyTopRange.shortTerm]: [],
    [SpotifyTopRange.mediumTerm]: [],
    [SpotifyTopRange.longTerm]: [],
  }
  constructor(http: HttpClient) {
    this.http = http
  }
  async getTopItems(type: SpotifyItemType, range: SpotifyTopRange, offset: number): Promise<void> {
    const { token, items } = await this.http.getTopItems({
      token: localStorage.getItem(JafToken)!,
      type,
      range,
      offset,
    })
    localStorage.setItem(JafToken, token)
    switch (type) {
      case SpotifyItemType.artists:
        this.topArtistsMap[range].push(...items as ISpotifyArtist[])
        break
      case SpotifyItemType.tracks:
        this.topTracksMap[range].push(...items as ISpotifyTrack[])
        break
    }
  }
  async getAudioFeatures(range: SpotifyTopRange): Promise<void> {
    if (!this.topTracksMap[range]) {
      console.error('Unable to get audio features')
      console.error('No tracks loaded for range', range)
      return
    }
    const trackIds = this.topTracksMap[range]
    .slice(this.audioFeaturesMap[range].length)
    .map(t => t.id)
    const { token, audioFeatures } = await this.http.getAudioFeatures({
      token: localStorage.getItem(JafToken)!,
      trackIds,
    })
    localStorage.setItem(JafToken, token)
    this.audioFeaturesMap[range].push(...audioFeatures)
  }
}
