import * as React from 'react'
import authService from '../services/authService'

const SpotifyStart = () => {
  return (
    <div>
      <p>Keen to join? <a href={authService.startUrl}>Start here.</a> All good if not!!</p>
    </div>
  )
}

export default SpotifyStart