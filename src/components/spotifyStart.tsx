import * as React from 'react'
import httpClient from "../clients/httpClient"

const SpotifyStart = () => {
  return (
    <div>
      <p>Keen to join? <a href={httpClient.startUrl}>Start here.</a> All good if not!!</p>
    </div>
  )
}

export default SpotifyStart