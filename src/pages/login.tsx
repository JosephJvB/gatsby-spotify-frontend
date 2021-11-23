import { navigate } from "gatsby-link"
import * as React from "react"
import httpClient from "../clients/httpClient"
import JafAuth from "../components/jafAuth"
import { JafToken } from "../config"
import { TokenRequest } from "../models/requests"
import "../main.css"

const SpotifyCallback = () => {
  localStorage.getItem(JafToken)
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    const jafJwt = localStorage.getItem(JafToken)
    if (jafJwt) {
      validateJwt(jafJwt)
    }
  }, null)
  async function validateJwt(token): Promise<void> {
    try {
      const postData: TokenRequest = { token }
      setLoading(true)
      await httpClient.validateToken(postData)
      setLoading(false)
      // redirect to some page
    } catch (e) {
      setLoading(false)
      console.error(e)
      console.error('validateJwt failed')
    }
  }
  return (
    <div>
      <p>Spotify Callback page</p>
      {
        loading
          ? <p>Logging you in, please wait</p>
          : <JafAuth setLoading={setLoading} />
      }
    </div>
  )
}

export default SpotifyCallback