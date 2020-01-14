import { Action, action } from 'easy-peasy'

import Note, { TinyNote } from '../../typings/note'

export interface NoteStateModel {
  note: Note | null
  notes: TinyNote[]
  setNote: Action<NoteStateModel, Note>
  updateNote: Action<NoteStateModel, Note>
  deleteNote: Action<NoteStateModel, Note | TinyNote>
  setNotes: Action<NoteStateModel, TinyNote[]>
}

const noteState: NoteStateModel = {
  note: null,
  notes: [],
  setNote: action((state, note) => {
    state.note = { ...note, updatedAt: new Date().toISOString() }
  }),
  updateNote: action((state, note) => {
    const { body, ...tinyNote } = note
    state.notes = [tinyNote, ...state.notes.filter(n => n.id !== note.id)]
    state.note = { ...note, updatedAt: new Date().toISOString() }
  }),
  deleteNote: action((state, note) => {
    state.notes = state.notes.filter(n => n.id !== note.id)
    state.note = null
  }),
  setNotes: action((state, notes) => {
    state.notes = notes
  }),
}

export default noteState
