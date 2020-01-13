import firestore from './firebase/firestore'
import storage from './storage'
import { STATE_KEYS } from '../constants'

export async function syncNote(uid: string, nid: string) {
  const local = await storage.getNote(nid)
  const remote = await firestore.getNote(uid, nid)
  if (local && !remote) {
    await firestore.setNote(uid, local)
  } else if (remote && !local) {
    await storage.setNote(remote)
  } else if (remote && local) {
    if (new Date(local.updatedAt) > new Date(remote.updatedAt)) await firestore.setNote(uid, local)
    else if (new Date(local.updatedAt) < new Date(remote.updatedAt)) await storage.setNote(remote)
  } else {
    // await firestore.delNote(uid, nid)
  }
}

export async function syncNotes(uid: string, noteIds: string[]) {
  await Promise.all(noteIds.map(nid => syncNote(uid, nid)))
}

export async function syncState(uid: string, key: string) {
  const local = await storage.getState(key)
  const remote = await firestore.getState(uid, key)
  if (local.trim() !== '' && remote.trim() === '') {
    await firestore.setState(uid, key, local)
  } else if (remote.trim() !== '' && local.trim() === '') {
    await storage.setState(key, remote)
  } else if (remote.trim() !== '' && local.trim() !== '') {
    const l = JSON.parse(local)
    const r = JSON.parse(remote)
    if (new Date(l.data.updatedAt) > new Date(r.data.updatedAt))
      await firestore.setState(uid, key, local)
    else if (new Date(l.data.updatedAt) < new Date(r.data.updatedAt))
      await storage.setState(key, remote)
  }
}

export async function syncStates(uid: string) {
  await Promise.all(STATE_KEYS.map(key => syncState(uid, key)))
}

export default {
  syncNote,
  syncNotes,
  syncState,
  syncStates,
}
