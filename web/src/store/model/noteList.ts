import { Action, action, Thunk, thunk } from 'easy-peasy'

import Note from '../../typings/note'
import storage from '../../services/storage'

export interface NoteListModel {
  notes: Note[]
  create: Thunk<NoteListModel, Note>
  update: Thunk<NoteListModel, Note>
  delete: Thunk<NoteListModel, Note>
  _create: Action<NoteListModel, Note>
  _update: Action<NoteListModel, Note>
  _delete: Action<NoteListModel, Note>
}

const noteList: NoteListModel = {
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

export default noteList
