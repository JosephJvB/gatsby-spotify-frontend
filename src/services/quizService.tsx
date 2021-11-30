import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"
import { IQuiz } from "../models/quiz"

class QuizService {
  http: HttpClient
  currentQuiz: IQuiz
  constructor() {
    this.http = new HttpClient()
  }
  async loadQuiz() {
    if (this.currentQuiz) {
      return
    }
    const jwt = localStorage.getItem(JafToken)
    const { token, message, ...quiz } = await this.http.loadQuiz({ token: jwt })
    localStorage.setItem(JafToken, token)
    this.currentQuiz = quiz
  }
  async submitQuiz() {
    if (this.currentQuiz.answered) {
      return
    }
    const jwt = localStorage.getItem(JafToken)
    const { token, message, ...quiz } = await this.http.submitQuiz({
      token: jwt,
      quiz: this.currentQuiz,
    })
    localStorage.setItem(JafToken, token)
    this.currentQuiz = quiz
  }
}

export default new QuizService()