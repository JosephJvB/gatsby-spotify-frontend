import HttpClient from "../clients/httpClient"
import { AdminSpotifyId, JafToken } from "../config"
import { IQuestion, IQuiz, IQuizResponse, QuizType } from "../models/quiz"

export default class QuizService {
  http: HttpClient
  currentQuiz: IQuiz
  currentResponse: IQuizResponse
  constructor() {
    this.http = new HttpClient()
  }
  async loadQuiz() {
    const { token, message, quiz, quizResponse } = await this.http.loadQuiz({
      token: localStorage.getItem(JafToken),
      quizType: QuizType.track,
      quizId: 'current'
    })
    localStorage.setItem(JafToken, token)
    this.currentResponse = quizResponse
    this.currentQuiz = quiz
  }
  async submitQuiz(answers: IQuestion[]) {
    if (this.currentResponse) {
      return
    }
    const { token, message, quizResponse } = await this.http.submitQuiz({
      token: localStorage.getItem(JafToken),
      answers,
    })
    localStorage.setItem(JafToken, token)
    this.currentResponse = quizResponse
  }
  async generateQuiz(spotifyId: string) {
    if (spotifyId != AdminSpotifyId) {
      return
     }
     await this.http.generateQuiz({
       token: localStorage.getItem(JafToken),
       spotifyId: spotifyId,
       quizType: QuizType.track
     })
  }
}
