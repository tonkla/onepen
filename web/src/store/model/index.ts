import { persist } from 'easy-peasy'

import folderState, { FolderStateModel } from './folder'
import selectedState, { SelectedStateModel } from './selected'
import userState, { UserStateModel } from './user'

export interface StoreModel {
  folderState: FolderStateModel
  selectedState: SelectedStateModel
  userState: UserStateModel
}

const model: StoreModel = persist(
  {
    folderState,
    selectedState,
    userState,
  },
  { storage: 'localStorage' }
)

export default model
