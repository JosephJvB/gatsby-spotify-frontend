import { navigate } from 'gatsby-link'
import * as React from 'react'
import { ServiceContext } from '../../gatsby-browser'

interface Page {
  title: string
  path: string
}
const pages: Page[] = [
  { path: '/profile/', title: 'Profile' },
  { path: '/quiz/', title: 'Quiz' },
]
const adminPage: Page = {
  path: '/admin/',
  title: 'Admin'
}

export interface FooterProps {}

const Footer = (props: FooterProps) => {
  const { authService } = React.useContext(ServiceContext)
  const [dotMenuOpen, setDotMenuOpen] = React.useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false)
  const closePopups = () => {
    if (dotMenuOpen) setDotMenuOpen(false)
    if (profileMenuOpen) setProfileMenuOpen(false)
  }
  const pageActive = (p: Page) => {
    return typeof window !== 'undefined' && window.location.pathname == p.path
  }
  const pageClick = (p: Page) => {
    if (!pageActive(p)) {
      typeof window != 'undefined' && navigate(p.path)
    }
  }
  const logoutClick = async () => {
    try {
      await authService.logout()
    } catch (e) {
      console.error(e)
      console.error('logout failed')
    }
    typeof window != 'undefined' && navigate('/')
  }
  const openDots = () => {
    setDotMenuOpen(!dotMenuOpen)
  }
  const renderPages = [...pages]
  if (authService.loggedInUser && authService.isAdmin) {
    renderPages.push(adminPage)
  }
  return (
    <>
      { dotMenuOpen && <div onClick={closePopups} className="popupBackdrop"></div> }
      <footer>
        <div className="container flexRow" style={{height: '100%'}}>
          <div onClick={openDots} className="dotMenu">
            <span className="menuDot"></span>
            <span className="menuDot"></span>
            <span className="menuDot"></span>
          </div>
        </div>
      </footer>
      <div className={`dotMenuPanel ${dotMenuOpen ? 'open' : 'closed'}`}>
        {renderPages.map((p, i) => {
          let cls = 'menuItem'
          if (pageActive(p)) cls += ' menuItemActive'
          return <p key={i} className={cls} onClick={e => pageClick(p)}>{p.title}</p>
        })}
        <p className="menuItem" onClick={logoutClick}>Logout</p>
      </div>
    </>
  )
}

export default Footer