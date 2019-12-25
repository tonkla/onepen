import { persist } from 'easy-peasy'

import folderList, { FolderListModel } from './folderList'
import noteList, { NoteListModel } from './noteList'
import selected, { SelectedModel } from './selected'
import user, { UserModel } from './user'

export interface StoreModel {
  folderList: FolderListModel
  noteList: NoteListModel
  selected: SelectedModel
  user: UserModel
}

const model: StoreModel = persist(
  {
    folderList,
    noteList,
    selected,
    user,
  },
  { storage: 'localStorage' }
)

export default model
