import Note from '../../typings/note'
import User from '../../typings/user'

export async function getNote(user: User, nid: string): Promise<Note | null> {
  // TODO:
  // const key = `${uid}${nid}`
  return null
}

export async function setNote(user: User, note: Note) {
  // TODO:
  // const key = `${uid}${note.id}`
}

export async function getNotes(user: User, ids: string[]): Promise<Note[]> {
  // TODO:
  return []
}

export async function getState(user: User, key: string): Promise<string> {
  // TODO:
  return ''
}

export async function setState(user: User, key: string, value: string) {
  // TODO:
  // const k = `${user.uid}${key}`
}

export default {
  getNote,
  setNote,
  getNotes,
  getState,
  setState,
}
