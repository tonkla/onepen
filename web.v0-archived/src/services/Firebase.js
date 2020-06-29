import firebase from 'firebase/app'
import 'firebase/auth'

import firebaseConfig from '../configs/firebase.json'
firebase.initializeApp(firebaseConfig)

const Firebase = {
  signInWithGoogle: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider()
        const result = await firebase.auth().signInWithPopup(provider)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  },

  signOut: async () => {
    return new Promise(async (resolve) => {
      await firebase.auth().signOut()
      resolve(true)
    })
  },

  isSignedIn: async () => {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        user ? resolve(true) : resolve(false)
      })
    })
  },

  currentUser: async () => {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        resolve(user)
      })
    })
  },
}
export { Firebase }
