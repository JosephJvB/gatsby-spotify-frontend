
import * as React from "react"
import "../main.css"
import httpClient from "../clients/httpClient"
import { LoginRequestData, RegisterRequestData, TokenRequest } from "../models/requests"
import SpotifyStart from "../components/spotifyStart"
import { navigate } from "gatsby-link"
import { JafToken } from "../config"

export interface LoginProps {}

export enum LoginFormType {
  login = 'login',
  register = 'register',
}

const Login = (props: LoginProps) => {
  React.useEffect(() => {
    const jafJwt = localStorage.getItem(JafToken)
    if (jafJwt) {
      validateJwt(jafJwt)
    }
  }, [])
  const searchParams = new URLSearchParams(window.location.search)
  const spotifyCode = searchParams.get('code')

  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const [loginFormType, setLoginFormType] = React.useState<LoginFormType>(
    spotifyCode ? LoginFormType.register : LoginFormType.login
  )


  async function validateJwt(token): Promise<void> {
    try {
      const postData: TokenRequest = { token }
      setLoading(true)
      await httpClient.validateToken(postData)
      setLoading(false)
      // redirect to some page
      navigate('/')
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
    setLoading(true)
    e.preventDefault()
    try {
      switch (loginFormType) {
        case LoginFormType.login:
          await doLogin()
          break
        case LoginFormType.register:
          await doRegister()
          break
      }
      navigate('/')
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.error(e)
      console.error(loginFormType, 'failed')
    }
  }
  async function doLogin(): Promise<void> {
    const postData: LoginRequestData = { email, password }
    await httpClient.login(postData)
  }
  async function doRegister(): Promise<void> {
    if (!spotifyCode) {
      return
    }
    const postData: RegisterRequestData = {
      email,
      password,
      passwordConfirm,
      spotifyCode,
    }
    await httpClient.register(postData)
  }

  return (
    <>
      { loading
        ? <p>Logging you in, please wait</p>
        : <>
            <form onSubmit={e => submitForm(e)}>
              <div className="formElement">
                <label htmlFor="emailField">email</label>
                <input name="emailField" type="email" placeholder="enter email"
                  onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className="formElement">
                <label htmlFor="passwordField">password</label>
                <input name="passwordField" type="password" placeholder="enter password"
                  onChange={e => setPassword(e.target.value)}/>
              </div>
              {loginFormType == LoginFormType.register && <div className="formElement">
                <label htmlFor="passwordFieldConfirm">confirm password</label>
                <input name="passwordFieldConfirm" type="password" placeholder="enter password again"
                  onChange={e => setPasswordConfirm(e.target.value)} />
              </div>}
              <button type="submit">Submit</button>
            </form>
            { loginFormType == LoginFormType.login && !spotifyCode
              && <SpotifyStart />
            }
            { loginFormType == LoginFormType.login && !!spotifyCode
              && <div>
                <p>Don't have an account? <a onClick={changeLoginFormType}>Register here</a></p>
              </div>
            }
            { loginFormType == LoginFormType.register
              && <div>
                <p>Already have an account? <a onClick={changeLoginFormType}>Login here</a></p>
              </div>
            }
        </>
      }
    </>
  )
}

export default Login
