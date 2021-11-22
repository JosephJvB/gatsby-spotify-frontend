import * as React from "react"
import "../main.css"
import JafAuth from "../components/jafAuth"
import { JafJwtKey } from "../config"
import httpClient from "../clients/httpClient"

export enum LoginFormType {
  login = 'login',
  register = 'register',
}
export interface LoginRequestData {
  email: string
  password: string
  passwordConfirm?: string
}
export interface LoginResponseData {
  token: string
}

const IndexPage = () => {
  const [jafJwt, setJafJwt] = React.useState(localStorage.getItem(JafJwtKey))

  // if !token - send to jafAuth
  // if token in browser - validate token on backend
  // backend handle redirect
  // if token.expired - jafAuth - actually, frontend can't check if token is expired.
  // if !token.data.spotifyAuthorized - spotifyLogin
  // else - some account page
  function renderIndex() {
    if (!jafJwt) {

    }
  }

  function spotifyLogin() {
    return (
      <div>
        <p>Surrender your spotify account</p>
        <button onClick={e => httpClient.startSpotifyAuth()}>surrender</button>
      </div>
    )
  }

  return (
    <main>
      <title>Home Page</title>
      <h1>This is the start of something new</h1>
      {!!jafJwt ? spotifyLogin() : <JafAuth setJafJwt={setJafJwt} />
      }
    </main>
  )
}

export default IndexPage
