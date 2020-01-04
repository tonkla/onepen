import { Action, action } from 'easy-peasy'

import Note, { TinyNote } from '../../typings/note'

export interface NoteStateModel {
  notes: TinyNote[]
  setNotes: Action<NoteStateModel, TinyNote[]>
  update: Action<NoteStateModel, Note>
  delete: Action<NoteStateModel, Note>
}

const noteState: NoteStateModel = {
  notes: [],
  setNotes: action((state, notes) => {
    state.notes = notes
  }),
  update: action((state, note) => {
    const rest = state.notes.filter(n => n.id !== note.id)
    state.notes = [{ id: note.id, title: note.title, updatedAt: note.updatedAt }, ...rest]
  }),
  delete: action((state, note) => {
    state.notes = state.notes.filter(n => n.id !== note.id)
  }),
}

export default noteState
