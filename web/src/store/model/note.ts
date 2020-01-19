import { Action, action, Thunk, thunk } from 'easy-peasy'

import firestore from '../../services/firebase/firestore'
import storage from '../../services/storage'
import Note, { TinyNote } from '../../typings/note'

export interface NoteStateModel {
  note: Note | null
  create: Thunk<NoteStateModel, Note>
  update: Thunk<NoteStateModel, Note>
  delete: Thunk<NoteStateModel, Note | TinyNote>
  setNote: Action<NoteStateModel, Note>
  _update: Action<NoteStateModel, Note>
  _delete: Action<NoteStateModel, Note | TinyNote>

  notes: TinyNote[]
  setNotes: Action<NoteStateModel, TinyNote[]>
}

const noteState: NoteStateModel = {
  note: null,
  create: thunk(async (actions, note) => {
    const _n = { ...note, updatedAt: new Date().toISOString() }
    actions.setNote(_n)
    await storage.setNote(_n)
    await firestore.setNote(_n.owner, _n)
  }),
  update: thunk(async (actions, note) => {
    const _n = { ...note, updatedAt: new Date().toISOString() }
    actions._update(_n)
    await storage.setNote(_n)
    await firestore.setNote(_n.owner, _n)
  }),
  delete: thunk(async (actions, note) => {
    const _n = { ...note, updatedAt: new Date().toISOString() }
    actions._delete(_n)
    await storage.delNote(_n.id)
    await firestore.delNote(_n.owner, _n.id)
  }),
  setNote: action((state, note) => {
    state.note = note
  }),
  _update: action((state, note) => {
    const { body, ...tinyNote } = note
    state.notes = [tinyNote, ...state.notes.filter(n => n.id !== note.id)]
    state.note = note
  }),
  _delete: action((state, note) => {
    state.notes = state.notes.filter(n => n.id !== note.id)
    state.note = null
  }),

  notes: [],
  setNotes: action((state, notes) => {
    state.notes = notes
  }),
}

export default noteState
