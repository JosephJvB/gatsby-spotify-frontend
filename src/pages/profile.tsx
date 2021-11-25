import { navigate } from "gatsby-link"
import * as React from "react"
import "../main.css"
import authService from "../services/authService"

const ProfilePage = () => {
  if (!authService.isLoggedIn) {
    navigate('/login')
    return null
  }
  return (
    <main>
      <title>Profile</title>
      <h1>This is the start of something new</h1>
      <p>{authService.loggedInUser.email}</p>
      <img src={authService.loggedInUser.displayPicture} alt="" />
      <p>{authService.loggedInUser.displayName}</p>
    </main>
  )
}

export default ProfilePage
