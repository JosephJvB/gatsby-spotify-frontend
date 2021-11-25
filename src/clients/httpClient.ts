import axios, { AxiosResponse } from 'axios'
import { BaseApiUrl } from '../config'
import { LoginRequestData, RegisterRequestData, TokenRequest } from '../models/requests'
import { IAuthResponse, ITokenResponse } from '../models/responses'

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
}
