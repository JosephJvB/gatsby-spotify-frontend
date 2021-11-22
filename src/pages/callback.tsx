import axios, { AxiosResponse } from "axios"
import { navigate } from "gatsby-link"
import * as React from "react"
import httpClient from "../clients/httpClient"
import JafAuth from "../components/jafAuth"
import { JafSpotifyStateKey, JafJwtKey, BaseApiUrl } from "../config"
import { SpotifyCodeRequest } from "../models/requests"

export interface CallbackSearchParams {
  code?: string
  state?: string
}

const SpotifyCallback = () => {
  const [jafJwt, setJafJwt] = React.useState(localStorage.getItem(JafJwtKey))
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  async function submitParamsCode(code: string) {
    try {
      const postData: SpotifyCodeRequest = {
        code,
        token: jafJwt
      }
      setLoading(true)
      const jwt = await httpClient.submitSpotifyCode(postData)
      localStorage.setItem(JafJwtKey, jwt)
      setJafJwt(jwt)
      navigate('/success')
    } catch (e) {
      console.error(e)
      console.error('submit Spotify Code failed')
      setError('Failed to validate spotify credentials')
    }
    setLoading(false)
  }
  React.useEffect(() => {
    if (!jafJwt) {
      console.error('Jaf jwt missing')
      return setError('No current Jaf member logged in') // Should I make them log in again?
    }
    if (!code || !state) {
      console.error(
        'Missing callback params >',
        'code=' + code,
        'state=' + state,
      )
      return setError('Missing spotify credentials')
    }
    const jafState = localStorage.getItem(JafSpotifyStateKey)
    if (state != jafState) {
      console.error('State mismatch')
      return setError('Invalid spotify credentials')
    }
    submitParamsCode(code)
  }, null)
  return (
    <div>
      <p>Spotify Callback page</p>
      {(() => {
        if (loading) {
          return <p>Saving spotify credentials, please wait</p>
        }
        if (!jafJwt && code) {
          return <JafAuth
            setJafJwt={setJafJwt}
            spotifyCode={code}
            />
        }
        if (error) {
          return <p>{error}</p>
        }
        return <p>Are you ready for havoc</p>
      })()}
    </div>
  )
}

export default SpotifyCallback