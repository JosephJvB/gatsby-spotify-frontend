import axios, { AxiosResponse } from 'axios'
import { LoginFormType } from '../components/jafAuth'
import { BaseApiUrl, BaseSpotifyApiUrl, JafToken, SpotifyClientId, SpotifyScopes } from '../config'
import { LoginRequestData, RegisterRequestData, SpotifyCodeRequest, TokenRequest } from '../models/requests'
import { TokenResponse } from '../models/responses'

class HttpClient {
  constructor() {}

  async validateToken(data: TokenRequest): Promise<string> {
    const r: AxiosResponse<TokenResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'token/validate',
      data
    })
    localStorage.setItem(JafToken, r.data.token)
    return r.data.token
  }

  async login(data: LoginRequestData): Promise<string> {
    const r: AxiosResponse<TokenResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'login',
      data
    })
    localStorage.setItem(JafToken, r.data.token)
    return r.data.token
  }
  async register(data: RegisterRequestData): Promise<string> {
    const r: AxiosResponse<TokenResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'register',
      data
    })
    localStorage.setItem(JafToken, r.data.token)
    return r.data.token
  }

  async submitSpotifyCode(data: SpotifyCodeRequest): Promise<string> {
    const r: AxiosResponse<TokenResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'spotify/code',
      data,
    })
    return r.data.token
  }

  get startUrl() {
    return BaseSpotifyApiUrl + new URLSearchParams({
      response_type: 'code',
      client_id: SpotifyClientId,
      scope: SpotifyScopes,
      redirect_uri: window.location.origin + '/login',
    })
  }
}

export default new HttpClient()