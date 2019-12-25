import { Action, action } from 'easy-peasy'

export interface SelectedModel {
  folderId: string
  noteId: string
  setFolderId: Action<SelectedModel, string>
  setNoteId: Action<SelectedModel, string>
}

const selected: SelectedModel = {
  folderId: '',
  noteId: '',
  setFolderId: action((state, payload) => {
    state.folderId = payload
  }),
  setNoteId: action((state, payload) => {
    state.noteId = payload
  }),
}

export default selected
