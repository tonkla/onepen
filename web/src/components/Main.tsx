import React, { useEffect, useState } from 'react'

import firebase from '../services/firebase/auth'
import router from '../services/router'
import { useStoreActions } from '../store'

import Drawer from './Drawer'
import Editor from './Editor'

import '../styles/Main.scss'

const Main = () => {
  const [isLoaded, setLoaded] = useState(false)

  const setUser = useStoreActions(actions => actions.userState.set)

  useEffect(() => {
    ;(async () => {
      if (await firebase.isSignedIn()) {
        setUser('John Doe')
        setLoaded(true)
      } else router.goto('/login')
    })()
  }, [setUser])

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
