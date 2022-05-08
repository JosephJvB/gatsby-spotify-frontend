import * as React from 'react'
import { ServiceContext } from '../../gatsby-browser'

const SpotifyStart = () => {
  const { authService } = React.useContext(ServiceContext)
  return (
    <div style={{margin: 'auto'}}>
      <a href={authService.startUrl}>
        <p style={{color: 'white'}}>Keen to join? Start here. All good if not!! <img height="15" width="15" src="/static/external-link-alt-solid.svg" alt="" /></p>
      </a>
    </div>
  )
}

export default SpotifyStart