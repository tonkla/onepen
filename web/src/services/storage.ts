import localforage from 'localforage'

import Folder from '../typings/folder'
import Note from '../typings/note'
import { APP_NAME, NOTE_KEY_PREFIX, TRASH_KEY } from '../constants'

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: `[${APP_NAME}]`,
  version: 1.0,
})

export async function getNote(id: string): Promise<Note | null> {
  return await localforage.getItem(`${NOTE_KEY_PREFIX}${id}`)
}

export async function setNote(note: Note) {
  await localforage.setItem(`${NOTE_KEY_PREFIX}${note.id}`, {
    ...note,
    updatedAt: new Date().toISOString(),
  })
}

export async function delNote(id: string) {
  const note = await getNote(id)
  if (note) {
    await remove(note)
    await localforage.removeItem(`${NOTE_KEY_PREFIX}${id}`)
  }
}

export async function getTrash(): Promise<(Note | Folder)[]> {
  return (await localforage.getItem(TRASH_KEY)) || []
}

export async function setTrash(trash: (Note | Folder)[]) {
  await localforage.setItem(TRASH_KEY, trash)
}

export async function remove(item: Note | Folder) {
  const trash = await getTrash()
  if (trash) {
    await localforage.setItem(TRASH_KEY, [
      { ...item, updatedAt: new Date().toISOString() },
      ...trash,
    ])
  }
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
  getTrash,
  setTrash,
  remove,
  clear,
}
