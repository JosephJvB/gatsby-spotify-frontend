import axios, { AxiosResponse } from 'axios'
import { AdminSpotifyId, BaseApiUrl, PyAuth_ApiUrl, PyUserQuiz_ApiUrl, PyAdminQuiz_ApiUrl } from '../config'
import { ITopItemsRequest, ISubmitQuizRequest, IGenerateQuizRequest, IGetQuizRequest } from '../models/requests'
import { IAuthResponse, IAuthSessionResponse, ILoadQuizResponse, ITopItemsResponse } from '../models/responses'

export default class HttpClient {
  constructor() {}

  async validateSession(jwt: string): Promise<IAuthResponse> {
    const r: AxiosResponse<IAuthResponse> = await axios({
      method: 'get',
      url: PyAuth_ApiUrl + 'session',
      headers: {
        Authorization: 'Bearer ' + jwt
      }
    })
    return r.data
  }
  async login(spotifyCode: string): Promise<IAuthSessionResponse> {
    const r: AxiosResponse<IAuthSessionResponse> = await axios({
      method: 'get',
      url: PyAuth_ApiUrl + 'login',
      params: { spotifyCode }
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
  async loadQuiz(data: IGetQuizRequest): Promise<ILoadQuizResponse> {
    const r: AxiosResponse<ILoadQuizResponse> = await axios({
      method: 'get',
      url: PyUserQuiz_ApiUrl + 'quiz/' + data.quizType,
      params: { quizId: data.quizId },
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
    return r.data
  }
  async submitQuiz(data: ISubmitQuizRequest): Promise<ILoadQuizResponse> {
    const r: AxiosResponse<ILoadQuizResponse> = await axios({
      method: 'post',
      url: PyUserQuiz_ApiUrl + 'submit',
      data,
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
      url: PyAdminQuiz_ApiUrl + 'quiz/' + data.quizType,
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
  }
}
