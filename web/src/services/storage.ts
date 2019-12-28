import localforage from 'localforage'

import Note from '../typings/note'

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'onepen',
  version: 1.0,
})

const NOTE_KEY_PREFIX = 'note-'

export async function getNote(id: string): Promise<Note | null> {
  return await localforage.getItem(`${NOTE_KEY_PREFIX}${id}`)
}

export async function setNote(note: Note) {
  await localforage.setItem(`${NOTE_KEY_PREFIX}${note.id}`, note)
}

export async function removeNote(note: Note) {
  await localforage.removeItem(`${NOTE_KEY_PREFIX}${note.id}`)
}

export async function findNotesByIds(ids: string[]): Promise<Note[]> {
  const notes: any = []
  ids.forEach(id => {
    notes.push(getNote(id))
  })
  return (await Promise.all<Note>(notes)).filter(n => n)
}

export default {
  getNote,
  setNote,
  removeNote,
  findNotesByIds,
}
