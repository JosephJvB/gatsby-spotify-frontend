import { navigate } from "gatsby-link"
import * as React from "react"
import { JafToken } from "../config"
import "../main.css"

const IndexPage = () => {
  const jwt = localStorage.getItem(JafToken)
  if (!jwt) {
    navigate('/login')
  }
  return (
    <main>
      <title>Home Page</title>
      <h1>This is the start of something new</h1>
    </main>
  )
}

export default IndexPage
