import firebase from 'firebase/app'
import 'firebase/firestore'

import Folder from '../../typings/folder'
import Note from '../../typings/note'
import Settings from '../../typings/settings'
import { KEY_FOLDER, KEY_FOLDERS, KEY_NOTE, KEY_SETTINGS, KEY_TRASH } from '../../constants'

const db = firebase.firestore()

export async function getFolder(uid: string, fid: string): Promise<Folder | null> {
  try {
    const doc = await db
      .collection(uid)
      .doc(`${KEY_FOLDER}${fid}`)
      .get()
    const data: any = doc.data()
    return doc.exists ? data : null
  } catch (e) {
    // TODO: log error
    return null
  }
}

export async function setFolder(uid: string, folder: Folder) {
  try {
    await db
      .collection(uid)
      .doc(`${KEY_FOLDER}${folder.id}`)
      .set(folder)
  } catch (e) {
    // TODO: log error
  }
}

export async function delFolder(uid: string, folder: Folder) {
  try {
    await db
      .collection(uid)
      .doc(`${KEY_FOLDER}${folder.id}`)
      .delete()
    await remove(uid, folder.id)
  } catch (e) {
    // TODO: log error
  }
}

export async function getFolders(uid: string): Promise<Folder[]> {
  const folders: Folder[] = []
  const doc = await db
    .collection(uid)
    .doc(KEY_FOLDERS)
    .get()
  // Note: use `any` to simplify firestore.DocumentData
  if (doc.exists) {
    const { ids }: any = doc.data()
    ;(await Promise.all<Folder | null>(ids.map((fid: string) => getFolder(uid, fid)))).forEach(
      f => {
        if (f) folders.push(f)
      }
    )
  }
  return folders
}

export async function setFolderIds(uid: string, ids: string[]) {
  try {
    await db
      .collection(uid)
      .doc(KEY_FOLDERS)
      .set({ ids, owner: uid, updatedAt: new Date().toISOString() })
  } catch (e) {
    // TODO: log error
  }
}

export async function getNote(uid: string, nid: string): Promise<Note | null> {
  try {
    const doc = await db
      .collection(uid)
      .doc(`${KEY_NOTE}${nid}`)
      .get()
    // Note: use `any` to simplify firestore.DocumentData
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
      .doc(`${KEY_NOTE}${note.id}`)
      .set(note)
  } catch (e) {
    // TODO: log error
  }
}

export async function delNote(uid: string, nid: string) {
  try {
    await db
      .collection(uid)
      .doc(`${KEY_NOTE}${nid}`)
      .delete()
    await remove(uid, nid)
  } catch (e) {
    // TODO: log error
  }
}

export async function getNotes(uid: string, ids: string[]): Promise<Note[]> {
  // Note: notes.filter(n => n) returns `(Note | null)[]`
  const notes: Note[] = []
  ;(await Promise.all(ids.map(nid => getNote(uid, nid)))).forEach(n => {
    if (n) notes.push(n)
  })
  return notes
}

export async function getSettings(uid: string): Promise<Settings | null> {
  try {
    const doc = await db
      .collection(uid)
      .doc(KEY_SETTINGS)
      .get()
    const data: any = doc.data()
    return doc.exists ? data : null
  } catch (e) {
    // TODO: log error
    return null
  }
}

export async function setSettings(uid: string, settings: Settings) {
  try {
    await db
      .collection(uid)
      .doc(KEY_SETTINGS)
      .set(settings)
  } catch (e) {
    // TODO: log error
  }
}

type RemovedItem = {
  id: string
  deletedAt: string
}

export async function isRemoved(uid: string, itemId: string): Promise<boolean> {
  return (await getRemovedItems(uid)).find(item => item.id === itemId) !== undefined
}

async function getRemovedItems(uid: string): Promise<RemovedItem[]> {
  try {
    const doc = await db
      .collection(uid)
      .doc(KEY_TRASH)
      .get()
    const data: any = doc.data()
    return doc.exists ? data.items : []
  } catch (e) {
    // TODO: log error
    return []
  }
}

async function remove(uid: string, itemId: string) {
  try {
    const trash = await getRemovedItems(uid)
    await db
      .collection(uid)
      .doc(KEY_TRASH)
      .set({ items: [{ id: itemId, deletedAt: new Date().toISOString() }, ...trash] })
  } catch (e) {
    // TODO: log error
  }
}

export default {
  getFolder,
  setFolder,
  delFolder,
  getFolders,
  setFolderIds,
  getNote,
  setNote,
  delNote,
  getNotes,
  getSettings,
  setSettings,
  isRemoved,
}
