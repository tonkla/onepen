import localforage from 'localforage'

import Note from '../typings/note'
import { APP_NAME, NOTE_KEY_PREFIX } from '../constants'

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: `[${APP_NAME}]`,
  version: 1.0,
})

export async function getNote(id: string): Promise<Note | null> {
  return await localforage.getItem(`${NOTE_KEY_PREFIX}${id}`)
}

export async function setNote(note: Note) {
  await localforage.setItem(`${NOTE_KEY_PREFIX}${note.id}`, note)
}

export async function delNote(id: string) {
  await localforage.removeItem(`${NOTE_KEY_PREFIX}${id}`)
}

export async function getNotes(ids: string[]): Promise<Note[]> {
  const asyncTasks: any = []
  ids.forEach(id => asyncTasks.push(getNote(id)))
  return (await Promise.all<Note>(asyncTasks))
    .filter(n => n)
    .sort((a, b) => (new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1))
}

export async function setNotes(notes: Note[]) {
  await Promise.all(notes.map(note => setNote(note)))
}

export async function getState(key: string): Promise<string> {
  return localStorage.getItem(key) || ''
}

export async function setState(key: string, value: string) {
  localStorage.setItem(key, value)
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
  getState,
  setState,
  clear,
}
