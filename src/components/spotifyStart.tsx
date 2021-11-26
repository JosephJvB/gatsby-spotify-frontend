import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import authService from '../services/authService'

const SpotifyStart = () => {

  return (
    <div style={{marginTop: '20px'}}>
      <a href={authService.startUrl}>
        <p style={{color: 'white'}}>Keen to join? Start here. All good if not!! <FontAwesomeIcon icon={faExternalLinkAlt}/></p>
      </a>
    </div>
  )
}

export default SpotifyStart