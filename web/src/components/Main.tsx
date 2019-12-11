import React, { useEffect, useState } from 'react'

import Drawer from './Drawer'
import Editor from './Editor'
import firebase from '../services/firebase/auth'
import router from '../services/router'

import '../styles/Main.scss'

const Main = () => {
  const [isLoaded, setLoad] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (await firebase.isSignedIn()) setLoad(true)
      else router.goto('/login')
    })()
  }, [])

  return isLoaded ? (
    <div className="main">
      <Drawer />
      <Editor />
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default Main
