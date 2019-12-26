import { Action, action } from 'easy-peasy'

export interface SelectedStateModel {
  folderId: string
  noteId: string
  setFolderId: Action<SelectedStateModel, string>
  setNoteId: Action<SelectedStateModel, string>
}

const selectedState: SelectedStateModel = {
  folderId: '',
  noteId: '',
  setFolderId: action((state, id) => {
    state.folderId = id
  }),
  setNoteId: action((state, id) => {
    state.noteId = id
  }),
}

export default selectedState
