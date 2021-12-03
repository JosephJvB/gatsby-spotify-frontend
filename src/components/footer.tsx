import { navigate } from 'gatsby-link'
import * as React from 'react'
import authService from '../services/authService'
import quizService from '../services/quizService'
import ProfilePicture, { ProfilePicSize } from './profilePicture'

interface Page {
  title: string
  path: string
}
const pages: Page[] = [
  { path: '/profile', title: 'Profile' },
  { path: '/quiz', title: 'Quiz' },
]

export interface FooterProps {
  score?: number
  total?: number
}

const Footer = (props: FooterProps) => {
  const [dotMenuOpen, setDotMenuOpen] = React.useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false)
  const closePopups = () => {
    if (dotMenuOpen) setDotMenuOpen(false)
    if (profileMenuOpen) setProfileMenuOpen(false)
  }
  const pageActive = (p: Page) => {
    return window.location.pathname == p.path
  }
  const pageClick = (p: Page) => {
    if (!pageActive(p)) {
      navigate(p.path)
    }
  }
  const logoutClick = () => {
    authService.logout()
    navigate('/')
  }
  const openDots = () => {
    setDotMenuOpen(!dotMenuOpen)
  }
  return (
    <>
      { dotMenuOpen && <div onClick={closePopups} className="popupBackdrop"></div> }
      <footer>
        <div className="container flexRow" style={{height: '100%'}}>
          { (!isNaN(props.score) && !isNaN(props.total)) ?
              <p className="score">Score: {props.score} / {props.total}</p>
              : null
          }
          {/* <ProfilePicture size={ProfilePicSize.thumbnail} vCenter={true} /> */}
          <div onClick={openDots} className="dotMenu">
            <span className="menuDot"></span>
            <span className="menuDot"></span>
            <span className="menuDot"></span>
          </div>
        </div>
      </footer>
      { <div className={`dotMenuPanel ${dotMenuOpen ? 'open' : 'closed'}`}>
        {pages.map((p, i) => {
          let cls = 'menuItem'
          if (pageActive(p)) cls += ' menuItemActive'
          return <p key={i} className={cls} onClick={e => pageClick(p)}>{p.title}</p>
        })}
        <p className="menuItem" onClick={logoutClick}>Logout</p>
      </div> }
    </>
  )
}

export default Footer