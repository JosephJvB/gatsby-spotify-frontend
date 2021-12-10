import HttpClient from "../clients/httpClient"
import { AdminSpotifyId, JafToken } from "../config"
import { IQuestion, IQuiz } from "../models/quiz"

class QuizService {
  http: HttpClient
  currentQuiz: IQuiz
  answered: boolean
  constructor() {
    this.http = new HttpClient()
  }
  async loadQuiz() {
    const { token, message, answered, quiz } = await this.http.loadQuiz({
      token: localStorage.getItem(JafToken)
    })
    localStorage.setItem(JafToken, token)
    this.answered = answered
    this.currentQuiz = quiz
  }
  async submitQuiz(answers: IQuestion[]) {
    if (this.answered) {
      return
    }
    const { token, message, answered, quiz } = await this.http.submitQuiz({
      token: localStorage.getItem(JafToken),
      answers,
    })
    localStorage.setItem(JafToken, token)
    this.answered = answered
    this.currentQuiz = quiz
  }
  async generateQuiz(spotifyId: string) {
    if (spotifyId != AdminSpotifyId) {
      return
     }
     await this.http.generateQuiz({
       token: localStorage.getItem(JafToken),
       spotifyId: spotifyId,
     })
  }
}

export default new QuizService()