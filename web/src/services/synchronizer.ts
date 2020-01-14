import firestore from './firebase/firestore'
import storage from './storage'
import { STATE_KEYS } from '../constants'

export async function syncNote(uid: string, nid: string) {
  const localNote = await storage.getNote(nid)
  const remoteNote = await firestore.getNote(uid, nid)
  const localTrash = await storage.getTrash()
  const remoteTrash = await firestore.getTrash(uid)
  if (localNote && !remoteNote) {
    if (!remoteTrash.find(item => item.id === localNote.id)) {
      await firestore.setNote(uid, localNote)
    }
  } else if (remoteNote && !localNote) {
    if (!localTrash.find(item => item.id === remoteNote.id)) {
      await storage.setNote(remoteNote)
    }
  } else if (remoteNote && localNote) {
    if (new Date(localNote.updatedAt) > new Date(remoteNote.updatedAt))
      await firestore.setNote(uid, localNote)
    else if (new Date(localNote.updatedAt) < new Date(remoteNote.updatedAt))
      await storage.setNote(remoteNote)
  }
}

export async function syncNotes(uid: string, noteIds: string[]) {
  await Promise.all(noteIds.map(nid => syncNote(uid, nid)))
}

export async function syncState(uid: string, key: string) {
  const localState = await storage.getState(key)
  const remoteState = await firestore.getState(uid, key)
  if (localState.trim() !== '' && remoteState.trim() === '') {
    await firestore.setState(uid, key, localState)
  } else if (remoteState.trim() !== '' && localState.trim() === '') {
    await storage.setState(key, remoteState)
  } else if (remoteState.trim() !== '' && localState.trim() !== '') {
    const l = JSON.parse(localState)
    const r = JSON.parse(remoteState)
    if (new Date(l.data.updatedAt) > new Date(r.data.updatedAt))
      await firestore.setState(uid, key, localState)
    else if (new Date(l.data.updatedAt) < new Date(r.data.updatedAt))
      await storage.setState(key, remoteState)
  }
}

export async function syncStates(uid: string) {
  await Promise.all(STATE_KEYS.map(key => syncState(uid, key)))
}

export async function syncTrash(uid: string) {
  const localTrash = await storage.getTrash()
  if (localTrash.length > 0) {
    const remoteTrash = await firestore.getTrash(uid)
    await firestore.setTrash(uid, [...localTrash, ...remoteTrash])
    await storage.setTrash([])
  }
  // TODO: remove items on the remote trash that older than 30 days
}

export default {
  syncNote,
  syncNotes,
  syncState,
  syncStates,
  syncTrash,
}
