import Note from '../../typings/note'

export async function getNote(id: string): Promise<Note | null> {
  return null
}

export async function setNote(note: Note) {
  //
}

export async function findNotesByIds(ids: string[]): Promise<Note[]> {
  return []
}

export default {
  getNote,
  setNote,
  findNotesByIds,
}
