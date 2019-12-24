import { persist } from 'easy-peasy'

import folderList, { FolderListModel } from './folderList'
import user, { UserModel } from './user'

export interface StoreModel {
  folderList: FolderListModel
  user: UserModel
}

const model: StoreModel = persist(
  {
    folderList,
    user,
  },
  { storage: 'localStorage' }
)

export default model
