import axios, { AxiosResponse } from 'axios'
import { BaseApiUrl } from '../config'
import { ITopItemsRequest, LoginRequestData, RegisterRequestData, TokenRequest } from '../models/requests'
import { IAuthResponse, ITopItemsResponse } from '../models/responses'

export default class HttpClient {
  constructor() {}

  async validateToken(data: TokenRequest): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'get',
      url: BaseApiUrl + 'token/validate',
      headers: {
        Authorization: 'Bearer ' + data.token
      }
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
  async getTopItems(data: ITopItemsRequest): Promise<ITopItemsResponse> {
    const { token, ...params } = data
    const r: AxiosResponse<ITopItemsResponse> = await axios({
      method: 'get',
      url: BaseApiUrl + 'spotify/top',
      params,
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    return r.data
  }
}
