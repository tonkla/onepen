import { Action, action } from 'easy-peasy'

export interface SelectedStateModel {
  folderId: string
  noteId: string
  updatedAt: string
  setFolderId: Action<SelectedStateModel, string>
  setNoteId: Action<SelectedStateModel, string>
}

const selectedState: SelectedStateModel = {
  folderId: '',
  noteId: '',
  updatedAt: '',
  setFolderId: action((state, id) => {
    state.folderId = id
    state.updatedAt = new Date().toISOString()
  }),
  setNoteId: action((state, id) => {
    state.noteId = id
    state.updatedAt = new Date().toISOString()
  }),
}

export default selectedState
