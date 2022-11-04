import axios, { AxiosResponse } from 'axios'
import { AdminSpotifyId,
  TS_ApiUrl,
  PyAuth_ApiUrl,
  PyUserQuiz_ApiUrl,
  PyAdminQuiz_ApiUrl,
  Golang_ApiUrl,
} from '../config'
import { ITopItemsRequest,
  ISubmitQuizRequest,
  IGenerateQuizRequest,
  IGetQuizRequest,
  ILoadUsersRequest,
  IGetAudioFeaturesRequest,
} from '../models/requests'
import { IAuthResponse,
  IAuthSessionResponse,
  IGetAudioFeaturesResponse,
  ILoadQuizResponse,
  ILoadUsersResponse,
  ITopItemsResponse,
} from '../models/responses'

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
      params: {
        spotifyCode,
        redirectUrlOverride: window.location.origin
      }
    })
    return r.data
  }
  async getTopItems(data: ITopItemsRequest): Promise<ITopItemsResponse> {
    const { token, ...params } = data
    const r: AxiosResponse<ITopItemsResponse> = await axios({
      method: 'get',
      url: TS_ApiUrl + 'spotify/top',
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
    const r: AxiosResponse = await axios({
      method: 'post',
      url: PyAdminQuiz_ApiUrl + 'quiz/' + data.quizType,
      data,
      headers: {
        Authorization: 'Bearer ' + data.token
      }
    })
  }
  async loadUsers(data: ILoadUsersRequest): Promise<ILoadUsersResponse> {
    const r: AxiosResponse<ILoadUsersResponse> = await axios({
      method: 'get',
      url: Golang_ApiUrl + 'users',
      headers: {
        Authorization: 'Bearer ' + data.token,
      }
    })
    return r.data
  }
  async getAudioFeatures(data: IGetAudioFeaturesRequest): Promise<IGetAudioFeaturesResponse> {
    const r: AxiosResponse<IGetAudioFeaturesResponse> = await axios({
      method: 'get',
      url: TS_ApiUrl + 'spotify/audio-features',
      params: {
        trackIds: data.trackIds.join(',')
      },
      headers: {
        Authorization: 'Bearer ' + data.token,
      }
    })
    return r.data
  }
}
