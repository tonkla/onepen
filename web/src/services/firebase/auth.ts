import firebase from 'firebase/app'
import 'firebase/auth'

import firebaseConfig from '../../firebase-config.json'
firebase.initializeApp(firebaseConfig)

export async function currentUser() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      resolve(user)
    })
  })
}

export async function isSignedIn() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? resolve(true) : resolve(false)
    })
  })
}

export async function signInWithGoogle() {
  return new Promise(async (resolve) => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithPopup(provider)
      resolve(true)
    } catch (err) {
      // TODO: log err
      resolve(false)
    }
  })
}

export async function signOut() {
  return new Promise(async (resolve) => {
    await firebase.auth().signOut()
    resolve(true)
  })
}

export default {
  currentUser,
  isSignedIn,
  signInWithGoogle,
  signOut,
}
