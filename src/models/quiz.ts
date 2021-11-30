export interface IQuiz {
  answered: boolean
  questions: IQuestion[]
}
export interface IQuestion {
  id: string
  label: string
  answer?: string
}