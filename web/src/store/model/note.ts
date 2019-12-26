import { Action, action, Thunk, thunk } from 'easy-peasy'

import Note from '../../typings/note'
import storage from '../../services/storage'

export interface NoteStateModel {
  notes: Note[]
  create: Thunk<NoteStateModel, Note>
  update: Thunk<NoteStateModel, Note>
  delete: Thunk<NoteStateModel, Note>
  _create: Action<NoteStateModel, Note>
  _update: Action<NoteStateModel, Note>
  _delete: Action<NoteStateModel, Note>
}

const noteState: NoteStateModel = {
  notes: [],
  create: thunk(async (actions, note) => {
    await storage.setNote(note)
    actions._create(note)
  }),
  update: thunk(async (actions, note) => {
    await storage.setNote(note)
    actions._update(note)
  }),
  delete: thunk(async (actions, note) => {
    await storage.removeNote(note)
    actions._delete(note)
  }),
  _create: action((state, note) => {
    state.notes = [...state.notes, note]
  }),
  _update: action((state, note) => {
    const rest = state.notes.filter(n => n.id !== note.id)
    state.notes = [...rest, note]
  }),
  _delete: action((state, note) => {
    state.notes = state.notes.filter(n => n.id !== note.id)
  }),
}

export default noteState
