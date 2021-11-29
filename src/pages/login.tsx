
import * as React from "react"
import { LoginRequestData, RegisterRequestData, TokenRequest } from "../models/requests"
import SpotifyStart from "../components/spotifyStart"
import { navigate } from "gatsby-link"
import { JafToken } from "../config"
import authService from "../services/authService"
import Header from "../components/header"
import ProfilePicture, { ProfilePicSize } from "../components/profilePicture"
import "../main.css"

export interface LoginProps {}

export enum LoginFormType {
  login = 'login',
  register = 'register',
}

const Login = (props: LoginProps) => {
  const searchParams = new URLSearchParams(window.location.search)
  const spotifyCode = searchParams.get('code')
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const [loginFormType, setLoginFormType] = React.useState<LoginFormType>(
    spotifyCode ? LoginFormType.register : LoginFormType.login
  )
  const [expiryTimeout, setExpiryTimeout] = React.useState<NodeJS.Timeout | null>()
  const [formError, setFormError] = React.useState('')
  React.useEffect(() => {
    const token = localStorage.getItem(JafToken)
    console.log('usEffect', token)
    if (token) {
      validateJwt(token)
    }
  }, [])

  async function validateJwt(jwt: string): Promise<void> {
    try {
      setLoading(true)
      await authService.validateToken(jwt)
      await new Promise(r => setTimeout(r, 5 * 1000))
      setLoading(false)
      navigate('/profile')
    } catch (e) {
      setLoading(false)
      console.error(e)
      console.error('validateJwt failed')
    }
  }

  function changeLoginFormType() {
    if (loginFormType == LoginFormType.login && !!spotifyCode) { // can only register with code
      return setLoginFormType(LoginFormType.register)
    }
    if (loginFormType == LoginFormType.register) {
      return setLoginFormType(LoginFormType.login)
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      switch (loginFormType) {
        case LoginFormType.login:
          await doLogin()
          break
        case LoginFormType.register:
          await doRegister()
          break
      }
      navigate('/profile')
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.error(e)
      console.error(loginFormType, 'failed')
    }
  }
  async function doLogin(): Promise<void> {
    const postData: LoginRequestData = { email, password }
    await authService.login(postData)
  }
  async function doRegister(): Promise<void> {
    if (!spotifyCode) {
      return
    }
    if (password != passwordConfirm) {
      setFormError('Passwords do not match')
      return
    }
    const postData: RegisterRequestData = {
      email,
      password,
      passwordConfirm,
      spotifyCode,
    }
    await authService.register(postData)
  }
  return (
    <>
      <Header />
      <main className="container">
        <section>
          <ProfilePicture size={ProfilePicSize.full} hCenter={true} spin={loading} />
          <form className="loginForm" onSubmit={e => submitForm(e)}>
            <div className="formElement">
              <label htmlFor="emailField">Email</label>
              <input name="emailField" type="email" placeholder="enter email"
                disabled={loading}
                onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="formElement">
              <label htmlFor="passwordField">Password</label>
              <input name="passwordField" type="password" placeholder="enter password"
                disabled={loading}
                onChange={e => setPassword(e.target.value)}/>
            </div>
            { loginFormType == LoginFormType.register &&
              <div className="formElement">
                <label htmlFor="passwordFieldConfirm">Confirm password</label>
                <input name="passwordFieldConfirm" type="password" placeholder="enter password again"
                  disabled={loading}
                  onChange={e => setPasswordConfirm(e.target.value)} />
              </div>
              }
            <button className="submitButton" type="submit">Submit</button>
          </form>
        </section>
      </main>
      <footer className="loginFooter">
        { loginFormType == LoginFormType.login && !spotifyCode &&
          <SpotifyStart />
        }
        { loginFormType == LoginFormType.login && !!spotifyCode &&
          <div>
            <a onClick={changeLoginFormType}>
              <p>Don't have an account? Register here</p>
            </a>
          </div>
        }
        { loginFormType == LoginFormType.register &&
          <div>
            <a onClick={changeLoginFormType}>
              <p>Already have an account? Login here</p>
            </a>
          </div>
        }
      </footer>
    </>
  )
}

export default Login
