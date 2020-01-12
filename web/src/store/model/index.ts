import { persist } from 'easy-peasy'

import folderState, { FolderStateModel } from './folder'
import noteState, { NoteStateModel } from './note'
import selectedState, { SelectedStateModel } from './selected'
import settingsState, { SettingsStateModel } from './settings'
import userState, { UserStateModel } from './user'

export interface StoreModel {
  folderState: FolderStateModel
  noteState: NoteStateModel
  selectedState: SelectedStateModel
  settingsState: SettingsStateModel
  userState: UserStateModel
}

const model: StoreModel = persist(
  {
    folderState,
    noteState,
    selectedState,
    settingsState,
    userState,
  },
  { storage: 'localStorage', blacklist: ['noteState', 'userState'] }
)

export default model
