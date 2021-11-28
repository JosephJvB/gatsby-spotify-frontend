import { navigate } from 'gatsby-link'
import * as React from 'react'
import Footer from '../components/footer'
import authService from '../services/authService'

const Quiz = () => {
  if (!authService.loggedInUser) {
    navigate('/login')
    return null
  }
  return (
    <>
      <main>
        some kind of quiz page
      </main>
      <Footer />
    </>
  )
}

export default Quiz