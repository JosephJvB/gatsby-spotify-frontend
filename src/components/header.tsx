import * as React from 'react'
import { Helmet } from 'react-helmet'
import "../main.css"
import questionSvg from '../images/question-circle-solid.svg'

const Header = () => {
  return (
    <header>
      <Helmet>
        <title>Unwrapped</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href={questionSvg}></link>
      </Helmet>
    </header>
  )
}

export default Header