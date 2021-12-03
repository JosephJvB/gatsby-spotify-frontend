import * as React from 'react'
import { Helmet } from 'react-helmet'
import "../main.css"

const Header = () => {
  return (
    <header>
      <Helmet>
        <title>JAF Unwrapped</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/static/question-circle-solid.svg"></link>
      </Helmet>
    </header>
  )
}

export default Header