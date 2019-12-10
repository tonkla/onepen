import React, { useEffect } from 'react'

import firebase from '../services/firebase/auth'
import router from '../services/router'

import '../styles/Login.scss'

const signInWithGoogle = async () => {
  if (await firebase.signInWithGoogle()) router.goto('/')
}

const Login = () => {
  useEffect(() => {
    ;(async () => {
      if (await firebase.isSignedIn()) router.goto('/')
    })()
  }, [])

  return (
    <div className="login">
      <div className="googlebtn" onClick={signInWithGoogle}>
        <img src="g-logo.png" alt="Google Logo" />
        <div>
          <span>Sign in with Google</span>
        </div>
      </div>
    </div>
  )
}

export default Login
