import { navigate } from 'gatsby-link'
import * as React from 'react'
import { ServiceContext } from '../../gatsby-browser'
import Footer from '../components/footer'
import Header from '../components/header'
import Question from '../components/question'
import { IQuestion } from '../models/quiz'

const Quiz = () => {
  const { authService, quizService } = React.useContext(ServiceContext)
  if (!authService.loggedInUser) {
    typeof window != 'undefined' && navigate('/?redirect=quiz')
    return null
  }
  const [loading, setLoading] = React.useState(false)
  const [quizStarted, setQuizStarted] = React.useState(false)
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const [quizAnswers, setQuizAnswers] = React.useState<IQuestion[]>([])
  const [generateQuizClicks, setGenerateQuizClicks] = React.useState(0)
  React.useEffect(() => {
    if (!quizService.currentQuiz) {
      loadQuiz()
    }
  }, [])
  async function loadQuiz() {
    setLoading(true)
    try {
      await quizService.loadQuiz()
    } catch (e) {
      console.error(e)
      console.error('loadQuiz failed')
    }
    setLoading(false)
  }
  const answerQuestion = (a: IQuestion) => {
    if (!!quizService.currentResponse) {
      return
    }
    const answers = [...quizAnswers]
    answers.push(a)
    const nextQuestion = questionIndex + 1
    if (quizService.currentQuiz.questions[nextQuestion]) {
      setQuizAnswers(answers)
      setQuestionIndex(questionIndex + 1)
    } else {
      submitQuiz(answers)
    }
  }
  async function submitQuiz(answers: IQuestion[]) {
    if (!!quizService.currentResponse) {
      return
    }
    setLoading(true)
    try {
      await quizService.submitQuiz(answers)
      setQuestionIndex(0)
      setQuizAnswers([])
    } catch (e) {
      console.error(e)
      console.error('submitQuiz failed')
    }
    setLoading(false)
  }
  async function adminGenerateQuiz() {
     if (!authService.isAdmin) {
      return
     }
     try {
       const nextClickCount = generateQuizClicks + 1
       if (nextClickCount == 5) {
         setLoading(true)
         await quizService.generateQuiz(authService.loggedInUser.spotifyId)
         setLoading(false)
         setGenerateQuizClicks(0)
         await loadQuiz()
        } else {
          setGenerateQuizClicks(nextClickCount)
        }
      } catch (e) {
        console.error(e)
        console.error('adminGenerateQuiz failed')
        setLoading(false)
     }
  }
  let imgClass = 'profileImg imgFull'
  if (loading) imgClass += ' imageRotate'
  const currentQuestion = quizService.currentQuiz?.questions && quizService.currentQuiz.questions[questionIndex]
  const questionResponse = quizService?.currentResponse?.answers[questionIndex]
  return (
    <>
      <Header />
      <main className="container">
        <section>
          { (!quizStarted || loading) &&
            <img className={imgClass} style={{margin: '0 auto'}}
              src="/static/question-circle-solid.svg" alt="question mark icon"
              onClick={authService.isAdmin ? adminGenerateQuiz : null}
              />
          }
          { !quizStarted &&
            <div className="quizInfo">
              <h1>Spotify "Unwrapped"</h1>
              <br />
              { !loading && !quizService.currentResponse &&
                <>
                  <p>How well do you know your mates?</p>
                  <br/>
                  <p>This quiz is a series of multi-choice questions.</p>
                  <p>You will be presented with a track, this track is one of your friends top 10 tracks. You must correctly guess whose top tracks the song has come from.</p>
                </>
              }
              { !loading && !!quizService.currentResponse &&
                <>
                  <p>You have answered the current quiz.</p>
                  <p>Click the review button to see how you did.</p>
                </>
              }
              { !loading && quizService.currentQuiz &&
                <button onClick={e => setQuizStarted(true)} className="startQuiz">
                  {!!quizService.currentResponse ? "Review" : "Get Started"}
                </button>
              }
            </div>
          }
          { !loading && quizStarted && currentQuestion &&
            <>
              <p className="questionIndex">{questionIndex + 1} / {quizService.currentQuiz.questions.length}</p>
              <Question question={currentQuestion} answer={answerQuestion} response={questionResponse} />
            </>
          }
          { !loading && quizStarted && quizService.currentResponse &&
            <div className="quizReview">
              <div className="reviewNav">
                <button className="reviewNavBtn"
                  disabled={!quizService.currentQuiz.questions[questionIndex - 1]}
                  onClick={e => setQuestionIndex(questionIndex - 1)}>prev</button>
                <button className="reviewNavBtn"
                  disabled={!quizService.currentQuiz.questions[questionIndex + 1]}
                  onClick={e => setQuestionIndex(questionIndex + 1)}>next</button>
              </div>
            </div>
          }
          { !loading && !!quizService.currentResponse &&
            <div className="score">
              <p>Your score:</p>
              <p>{quizService.currentResponse.score} / {quizService.currentQuiz.questions.length}</p>
            </div>
          }
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Quiz