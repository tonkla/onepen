import firebase from 'firebase/app'
import 'firebase/firestore'

import Note from '../../typings/note'
import { NOTE_KEY_PREFIX, STATE_KEY_PREFIX } from '../../constants'

const db = firebase.firestore()

export async function getNote(uid: string, nid: string): Promise<Note | null> {
  try {
    const doc = await db
      .collection(uid)
      .doc(`${NOTE_KEY_PREFIX}${nid}`)
      .get()
    const data: any = doc.data()
    return doc.exists ? data : null
  } catch (e) {
    // TODO: log error
    return null
  }
}

export async function setNote(uid: string, note: Note) {
  try {
    await db
      .collection(uid)
      .doc(`${NOTE_KEY_PREFIX}${note.id}`)
      .set(note)
  } catch (e) {
    // TODO: log error
  }
}

export async function delNote(uid: string, nid: string) {
  try {
    await db
      .collection(uid)
      .doc(`${NOTE_KEY_PREFIX}${nid}`)
      .delete()
  } catch (e) {
    // TODO: log error
  }
}

export async function getNotes(uid: string, ids: string[]): Promise<Note[]> {
  // Note: TypeScript warns about `return notes.filter(n => n)`
  const notes: Note[] = []
  ;(await Promise.all(ids.map(nid => getNote(uid, nid)))).forEach(n => {
    if (n) notes.push(n)
  })
  return notes
}

export async function getState(uid: string, key: string): Promise<string> {
  try {
    const doc = await db
      .collection(uid)
      .doc(`${STATE_KEY_PREFIX}${key}`)
      .get()
    if (doc.exists) {
      const data: any = doc.data()
      if (data) {
        const value: any = Object.values(data)[0]
        return value ? value : ''
      }
    }
    return ''
  } catch (e) {
    // TODO: log error
    return ''
  }
}

export async function setState(uid: string, key: string, value: string) {
  try {
    await db
      .collection(uid)
      .doc(`${STATE_KEY_PREFIX}${key}`)
      .set({ [key]: value })
  } catch (e) {
    // TODO: log error
  }
}

export default {
  getNote,
  setNote,
  delNote,
  getNotes,
  getState,
  setState,
}
