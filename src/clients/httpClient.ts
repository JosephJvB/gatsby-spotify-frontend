import axios, { AxiosResponse } from 'axios'
import { LoginFormType } from '../components/jafAuth'
import { BaseApiUrl, BaseSpotifyApiUrl, JafJwtKey, JafSpotifyStateKey, SpotifyClientId, SpotifyScopes } from '../config'
import { LoginRequestData, SpotifyCodeRequest } from '../models/requests'
import { TokenResponseData } from '../models/responses'

function getRandomChars (n = 16) {
  let s = ''
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  while (s.length < n) {
    const r = Math.floor(Math.random() * chars.length)
    s += chars[r]
  }
  return s
}

class HttpClient {
  constructor() {}

  startSpotifyAuth(): void {
    const state = getRandomChars()
    localStorage.setItem(JafSpotifyStateKey, state)
    const redirectUri = window.location.origin + '/callback'
    const spotifyUrl = BaseSpotifyApiUrl + 'authorize?' + new URLSearchParams({
      response_type: 'code',
      client_id: SpotifyClientId,
      scope: SpotifyScopes,
      redirect_uri: redirectUri,
      state,
    })
    window.location.replace(spotifyUrl)
  }

  async jafAuth(loginFormType: LoginFormType, data: LoginRequestData): Promise<string> {
    const r: AxiosResponse<TokenResponseData> = await axios({
      method: 'post',
      url: BaseApiUrl + loginFormType,
      data
    })
    localStorage.setItem(JafJwtKey, r.data.token)
    return r.data.token
  }

  async submitSpotifyCode(data: SpotifyCodeRequest): Promise<string> {
    const r: AxiosResponse<TokenResponseData> = await axios({
      method: 'post',
      url: BaseApiUrl + 'spotify/code',
      data,
    })
    return r.data.token
  }
}

export default new HttpClient()