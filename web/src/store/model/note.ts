import { Action, action, Thunk, thunk } from 'easy-peasy'

import Note from '../../typings/Note'
import storage from '../../services/storage'

interface NoteId {
  id: string
  parent: string
}

export interface NoteStateModel {
  noteIds: NoteId[]
  create: Thunk<NoteStateModel, Note>
  update: Thunk<NoteStateModel, Note>
  delete: Thunk<NoteStateModel, Note>
  _create: Action<NoteStateModel, Note>
  _update: Action<NoteStateModel, Note>
  _delete: Action<NoteStateModel, Note>
}

const noteState: NoteStateModel = {
  noteIds: [],
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
    state.noteIds = [...state.noteIds, { id: note.id, parent: note.parent }]
  }),
  _update: action((state, note) => {
    const rest = state.noteIds.filter(n => n.id !== note.id)
    state.noteIds = [...rest, { id: note.id, parent: note.parent }]
  }),
  _delete: action((state, note) => {
    state.noteIds = state.noteIds.filter(n => n.id !== note.id)
  }),
}

export default noteState
