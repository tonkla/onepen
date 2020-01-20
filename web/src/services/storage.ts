import localforage from 'localforage'

import Note from '../typings/note'
import { APP_NAME, KEY_NOTE } from '../constants'

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: `[${APP_NAME}]`,
  version: 1.0,
})

export async function getNote(id: string): Promise<Note | null> {
  return await localforage.getItem(`${KEY_NOTE}${id}`)
}

export async function setNote(note: Note) {
  await localforage.setItem(`${KEY_NOTE}${note.id}`, note)
}

export async function delNote(id: string) {
  const note = await getNote(id)
  if (note) await localforage.removeItem(`${KEY_NOTE}${id}`)
}

export async function getNotes(ids: string[]): Promise<Note[]> {
  const notes = await Promise.all(ids.map(id => getNote(id)))
  return notes
    .filter((n): n is Note => n !== null)
    .sort((a, b) =>
      a.updatedAt && b.updatedAt && new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1
    )
}

export async function setNotes(notes: Note[]) {
  await Promise.all(notes.map(note => setNote(note)))
}

export function clear() {
  localStorage.clear()
}

export default {
  getNote,
  setNote,
  delNote,
  getNotes,
  setNotes,
  clear,
}
