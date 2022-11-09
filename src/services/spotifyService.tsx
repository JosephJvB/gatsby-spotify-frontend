import { IAudioFeatures, ISpotifyArtist, ISpotifyTrack, SpotifyItemType, SpotifyTopRange } from "jvb-spotty-models"
import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"

export interface AudioFeaturesDisplay {
  acousticness: 0,
  danceability: 0,
  energy: 0,
  instrumentalness: 0,
  // key: 0,
  // liveness: 0,
  // mode: 0,
  // speechiness: 0,
  tempo: 0,
  // time_signature: 0,
  valence: 0,
}
export const featureLabelMap: {
  [featureName: string]: string
} = {
  valence: 'happiness'
}
export interface IFeatureAverage {
  featureName: string
  label: string
  value: string
}
export default class SpotifyService {
  http: HttpClient
  topTracksMap: {
    [timeRange: string]: ISpotifyTrack[]
  } = {}
  topArtistsMap: {
    [timeRange: string]: ISpotifyArtist[]
  } = {}
  audioFeaturesMap: {
    [timeRange: string]: IFeatureAverage[]
  } = {}
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
        this.topArtistsMap[range] = items as ISpotifyArtist[]
        break
      case SpotifyItemType.tracks:
        this.topTracksMap[range] = items as ISpotifyTrack[]
        break
    }
  }
  async getAudioFeatures(range: SpotifyTopRange): Promise<void> {
    if (!this.topTracksMap[range]) {
      console.error('Unable to get audio features')
      console.error('No tracks loaded for range', range)
      return
    }
    const trackIds = this.topTracksMap[range].map(t => t.id)
    const { token, audioFeatures } = await this.http.getAudioFeatures({
      token: localStorage.getItem(JafToken)!,
      trackIds,
    })
    localStorage.setItem(JafToken, token)
    this.audioFeaturesMap[range] = this.mapAudioFeatures(audioFeatures)
  }
  mapAudioFeatures(audioFeatures: IAudioFeatures[]): IFeatureAverage[] {
    const avgs: AudioFeaturesDisplay = {
      acousticness: 0,
      danceability: 0,
      energy: 0,
      instrumentalness: 0,
      // key: 0,
      // liveness: 0,
      // mode: 0,
      // speechiness: 0,
      tempo: 0,
      // time_signature: 0,
      valence: 0,
    }
    for (const trackFeature of audioFeatures) {
      for (const key in avgs) {
        (avgs as any)[key] += (trackFeature as any)[key]
      }
    }
    const displayKeys = Object.keys(avgs)
    return displayKeys.map(key => {
      const value = ((avgs as any)[key] / displayKeys.length).toFixed(2)
      return {
        featureName: key,
        label: featureLabelMap[key] || key,
        value,
      }
    })
  }
}
