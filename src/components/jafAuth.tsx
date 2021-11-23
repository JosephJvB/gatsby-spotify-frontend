
import * as React from "react"
import axios, { AxiosResponse } from 'axios'
import "../main.css"
import { BaseApiUrl, JafToken, SpotifyScopes } from "../config"
import httpClient from "../clients/httpClient"
import { LoginRequestData, RegisterRequestData } from "../models/requests"
import SpotifyStart from "./spotifyStart"

export interface JafAuthProps {
  setLoading: (boolean) => void
  spotifyCode?: string
}

export enum LoginFormType {
  login = 'login',
  register = 'register',
}

const JafAuth = (props: JafAuthProps) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const [loginFormType, setLoginFormType] = React.useState<LoginFormType>(
    props.spotifyCode ? LoginFormType.register : LoginFormType.login
  )
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')

  function changeLoginFormType() {
    if (loginFormType == LoginFormType.login && !!code) { // can only register with code
      return setLoginFormType(LoginFormType.register)
    }
    if (loginFormType == LoginFormType.register) {
      return setLoginFormType(LoginFormType.login)
    }
  }

  async function submitForm(e: React.FormEvent) {
    props.setLoading(true)
    e.preventDefault()
    switch (loginFormType) {
      case LoginFormType.login:
        await doLogin()
        break
      case LoginFormType.register:
        await doRegister()
        break
    }
    props.setLoading(false)
  }
  async function doLogin(): Promise<void> {
    try {
      const postData: LoginRequestData = { email, password }
      await httpClient.login(postData)
    } catch (e) {
      console.error(e)
      console.error('doLogin failed')
    }
  }
  async function doRegister(): Promise<void> {
    try {
      if (!props.spotifyCode) {
        return
      }
      const postData: RegisterRequestData = {
        email,
        password,
        passwordConfirm,
        spotifyCode: props.spotifyCode
      }
      await httpClient.register(postData)
    } catch (e) {
      console.error(e)
      console.error('doRegister failed')
    }
  }

  return (
    <>
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
      { loginFormType == LoginFormType.login && !props.spotifyCode
        && <SpotifyStart />
      }
      { loginFormType == LoginFormType.login && !!props.spotifyCode
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
  )
}

export default JafAuth
