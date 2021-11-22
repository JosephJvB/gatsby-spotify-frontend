
import * as React from "react"
import axios, { AxiosResponse } from 'axios'
import "../main.css"
import { BaseApiUrl, JafJwtKey } from "../config"
import httpClient from "../clients/httpClient"
import { LoginRequestData } from "../models/requests"

export interface JafAuthProps {
  setJafJwt: (string) => void
  spotifyCode?: string
}

export enum LoginFormType {
  login = 'login',
  register = 'register',
}

const JafAuth = (props: JafAuthProps) => {
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const [loginFormType, setLoginFormType] = React.useState<LoginFormType>(LoginFormType.login)

  async function submitForm(e: React.FormEvent) {
    try {
      e.preventDefault()
      const postData: LoginRequestData = { email, password }
      if (loginFormType == LoginFormType.register) {
        postData.passwordConfirm = passwordConfirm
      }
      if (!!props.spotifyCode) {
        postData.spotifyCode = props.spotifyCode
      }
      console.log('submitForm, type = ' + loginFormType)
      console.log(postData)
      setLoading(true)
      const jwt = await httpClient.jafAuth(loginFormType, postData)
      props.setJafJwt(jwt)
    } catch (e) {
      console.error(e)
      console.error('login form submit failed')
    }
    setLoading(false)
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
      { loginFormType == LoginFormType.login
        && <div>
          <p>Don't have an account? <a onClick={e => setLoginFormType(LoginFormType.register)}>Register here</a></p>
        </div>
      }
      { loginFormType == LoginFormType.register
        && <div>
          <p>Already have an account? <a onClick={e => setLoginFormType(LoginFormType.login)}>Login here</a></p>
        </div>
      }
    </>
  )
}

export default JafAuth
