import firestore from './firebase/firestore'
import storage from './storage'
import User from '../typings/user'
import { STATE_KEYS } from '../constants'

export async function syncNote(user: User, nid: string) {
  const local = await storage.getNote(nid)
  const remote = await firestore.getNote(user, nid)
  if (local && !remote) {
    await firestore.setNote(user, local)
  } else if (remote && !local) {
    await storage.setNote(remote)
  } else if (remote && local) {
    if (local.updatedAt > remote.updatedAt) await firestore.setNote(user, local)
    else if (local.updatedAt < remote.updatedAt) await storage.setNote(remote)
  }
}

export async function syncNotes(user: User, noteIds: string[]) {
  await Promise.all(noteIds.map(nid => syncNote(user, nid)))
}

export async function syncState(user: User, key: string) {
  const local = await storage.getState(key)
  const remote = await firestore.getState(user, key)
  if (local.trim() !== '' && remote.trim() === '') {
    await firestore.setState(user, key, local)
  } else if (remote.trim() !== '' && local.trim() === '') {
    await storage.setState(key, remote)
  } else if (remote.trim() !== '' && local.trim() !== '') {
    const l = JSON.parse(local)
    const r = JSON.parse(remote)
    if (l.updatedAt > r.updatedAt) await firestore.setState(user, key, local)
    else if (l.updatedAt < r.updatedAt) await storage.setState(key, remote)
  }
}

export async function syncStates(user: User) {
  await Promise.all(STATE_KEYS.map(key => syncState(user, key)))
}

export default {
  syncNote,
  syncNotes,
  syncState,
  syncStates,
}
