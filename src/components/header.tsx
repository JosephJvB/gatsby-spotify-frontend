import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import authService from '../services/authService'
import ProfilePicture, { ProfilePicSize } from './profilePicture'


const Header = () => {
  return (
    <header>
      <ProfilePicture size={ProfilePicSize.thumbnail} />
      { authService.loggedInUser &&
        <span className="notifsContainer">
          <FontAwesomeIcon className="notifs" icon={faBell} />
          <span className="notifsActive"></span>
        </span>
      }
    </header>
  )
}

export default Header