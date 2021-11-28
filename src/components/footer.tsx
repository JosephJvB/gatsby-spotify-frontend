import * as React from 'react'
import authService from '../services/authService'
import ProfilePicture, { ProfilePicSize } from './profilePicture'

const Footer = () => {
  const [dotMenuOpen, setDotMenuOpen] = React.useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false)
  return (
    <footer>
      <div className="container flexRow" style={{margin: 'auto'}}>
        <ProfilePicture size={ProfilePicSize.thumbnail} />
        <div className="dotMenu">
          <span className="menuDot"></span>
          <span className="menuDot"></span>
          <span className="menuDot"></span>
        </div>
      </div>
    </footer>
  )
}

export default Footer