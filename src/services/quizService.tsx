import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"
import { IQuestion, IQuiz } from "../models/quiz"

class QuizService {
  http: HttpClient
  currentQuiz: IQuiz
  answered: boolean
  constructor() {
    this.http = new HttpClient()
  }
  async loadQuiz() {
    if (this.currentQuiz) {
      return
    }
    const jwt = localStorage.getItem(JafToken)
    const { token, message, answered, quiz } = await this.http.loadQuiz({ token: jwt })
    localStorage.setItem(JafToken, token)
    this.answered = answered
    this.currentQuiz = quiz
  }
  async submitQuiz(answers: IQuestion[]) {
    if (this.answered) {
      return
    }
    const jwt = localStorage.getItem(JafToken)
    const { token, message, answered, quiz } = await this.http.submitQuiz({
      token: jwt,
      answers,
    })
    localStorage.setItem(JafToken, token)
    this.answered = answered
    this.currentQuiz = quiz
  }
}

export default new QuizService()