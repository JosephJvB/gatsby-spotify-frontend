import { navigate } from 'gatsby-link'
import * as React from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import authService from '../services/authService'
import quizService from '../services/quizService'

const Quiz = () => {
  if (!authService.loggedInUser) {
    navigate('/login?redirect=quiz')
    return null
  }
  const [loading, setLoading] = React.useState(false)
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
  let imgClass = 'profileImg imgFull'
  if (loading) imgClass += ' imageRotate'
  const quizAnswered = quizService.currentQuiz?.answered
  return (
    <>
      <Header />
      <main className="container">
        <section>
          <img className={imgClass} style={{margin: '0 auto'}} src="/static/question-circle-solid.svg" alt="question mark icon" />
          { !quizAnswered && <button className="startQuiz">Start quiz</button> }
          { quizAnswered &&
            <div>
              <pre>{JSON.stringify(quizService.currentQuiz)}</pre>
            </div>
          }
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Quiz