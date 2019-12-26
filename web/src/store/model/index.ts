import { persist } from 'easy-peasy'

import folderState, { FolderStateModel } from './folder'
import noteState, { NoteStateModel } from './note'
import selectedState, { SelectedStateModel } from './selected'
import userState, { UserStateModel } from './user'

export interface StoreModel {
  folderState: FolderStateModel
  noteState: NoteStateModel
  selectedState: SelectedStateModel
  userState: UserStateModel
}

const model: StoreModel = persist(
  {
    folderState,
    noteState,
    selectedState,
    userState,
  },
  { storage: 'localStorage' }
)

export default model
