import axios, { AxiosResponse } from 'axios'
import { AdminSpotifyId, BaseApiUrl, Py_BaseApiUrl } from '../config'
import { ITopItemsRequest, ILoginRequestData, IRegisterRequestData, ITokenRequest, ISubmitQuizRequest, IGenerateQuizRequest } from '../models/requests'
import { IAuthResponse, IQuizResponse, ITokenResponse, ITopItemsResponse } from '../models/responses'

export default class HttpClient {
  constructor() {}

  async validateToken(data: ITokenRequest): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'get',
      url: Py_BaseApiUrl + 'jwt',
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
    return r.data
  }
  async login(data: ILoginRequestData): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'post',
      url: Py_BaseApiUrl + 'login',
      data
    })
    return r.data
  }
  async register(data: IRegisterRequestData): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'post',
      url: Py_BaseApiUrl + 'register',
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
      data: { answers: data.answers },
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
    return r.data
  }
  async generateQuiz(data: IGenerateQuizRequest): Promise<void> {
    if (data.spotifyId != AdminSpotifyId) {
      return
    }
    const r: AxiosResponse = await axios({
      method: 'post',
      url: BaseApiUrl + 'quiz/generate',
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
  }
}
