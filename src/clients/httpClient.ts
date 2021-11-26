import axios, { AxiosResponse } from 'axios'
import { BaseApiUrl } from '../config'
import { LoginRequestData, RegisterRequestData, TokenRequest } from '../models/requests'
import { IAuthResponse, ITopTrackResponse } from '../models/responses'
import { ISpotifyTrack } from '../models/spotifyApi'

export default class HttpClient {
  constructor() {}

  async validateToken(data: TokenRequest): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'token/validate',
      data
    })
    return r.data
  }

  async login(data: LoginRequestData): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'login',
      data
    })
    return r.data
  }
  async register(data: RegisterRequestData): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'register',
      data
    })
    return r.data
  }
  async getTopTracks(token: string): Promise<ISpotifyTrack[]> {
    const r: AxiosResponse<ITopTrackResponse> = await axios({
      method: 'get',
      url: BaseApiUrl + 'top/tracks',
      params: { token }
    })
    return r.data.tracks
  }
  // async getTopArtists(token: string): Promise<ISpotifyArtist[]> {
  //   const r: AxiosResponse<ITopArtistResponse> = await axios({
  //     method: 'get',
  //     url: BaseApiUrl + 'top/artists',
  //     params: { token }
  //   })
  //   return r.data.artists
  // }
}
