import axios, { AxiosResponse } from 'axios'
import { BaseApiUrl } from '../config'
import { IQuiz } from '../models/quiz'
import { ITopItemsRequest, ILoginRequestData, IRegisterRequestData, ITokenRequest, ISubmitQuizRequest } from '../models/requests'
import { IAuthResponse, IQuizResponse, ITokenResponse, ITopItemsResponse } from '../models/responses'

export default class HttpClient {
  constructor() {}

  async validateToken(data: ITokenRequest): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'get',
      url: BaseApiUrl + 'token/validate',
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
    return r.data
  }
  async login(data: ILoginRequestData): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'login',
      data
    })
    return r.data
  }
  async register(data: IRegisterRequestData): Promise<IAuthResponse> {
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
  async loadQuiz(data: ITokenRequest): Promise<IQuizResponse> {
    const r: AxiosResponse<IQuizResponse> = await axios({
      method: 'get',
      url: BaseApiUrl + 'quiz',
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
    return r.data
  }
  async submitQuiz(data: ISubmitQuizRequest): Promise<IQuizResponse> {
    const r: AxiosResponse<IQuizResponse> = await axios({
      method: 'post',
      url: BaseApiUrl + 'quiz',
      data: { quiz: data.quiz },
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
    return r.data
  }
}
