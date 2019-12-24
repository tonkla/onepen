import { Action, action } from 'easy-peasy'

import Folder from '../../typings/folder'

export interface FolderListModel {
  folders: Folder[]
  create: Action<FolderListModel, Folder>
  update: Action<FolderListModel, Folder>
  delete: Action<FolderListModel, Folder>
}

const folderList: FolderListModel = {
  folders: [],
  create: action((state, payload) => {
    state.folders = [...state.folders, payload]
  }),
  update: action((state, payload) => {
    const rest = state.folders.filter(f => f.id !== payload.id)
    state.folders = [...rest, payload]
  }),
  delete: action((state, payload) => {
    state.folders = state.folders.filter(f => f.id !== payload.id)
  }),
}

export default folderList
