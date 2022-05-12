import * as React from "react"
import { navigate } from "gatsby-link"
import Header from "../components/header"
import { ServiceContext } from "../../gatsby-browser"
import { JafToken } from "../config"

export interface LoginProps {}

const Index = (props: LoginProps) => {
  const { authService } = React.useContext(ServiceContext)
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const searchParams = new URLSearchParams(window.location.search)
    const jwt = localStorage.getItem(JafToken)
    if (searchParams.has('code')) {
      doLogin(searchParams.get('code'))
    } else if (jwt) {
      validateSession(jwt, searchParams.get('redirect'))
    }
  }, [])
  
  async function validateSession(jwt: string, redirectPage: string): Promise<void> {
    try {
      setLoading(true)
      await authService.validateSession(jwt)
      setLoading(false)
      navigate('/' + redirectPage)
    } catch (e) {
      setLoading(false)
      console.error(e)
      console.error('validateSession failed')
    }
  }

  async function doLogin(spotifyCode: string): Promise<void> {
    try {
      setLoading(true)
      await authService.login(spotifyCode)
      setLoading(false)
      navigate('/profile')
    } catch (e) {
      setLoading(false)
      console.error(e)
      console.error('login failed')
    }
  }

  function startLoginFlow() {
    if (typeof window !== 'undefined') {
      window.location.href = authService.startUrl
    }
  }

  let imgClass = 'profileImg imgFull'
  if (loading) imgClass += ' imageRotate'
  return (
    <>
      <Header />
      <main className="container">
        <section>
          <img className={imgClass} style={{margin: '0 auto'}} src="/static/spotify.svg" alt="spotify icon logo" />
          <button className="submitButton" type="submit" onClick={startLoginFlow}>Login</button>
        </section>
      </main>
    </>
  )
}

export default Index
