import { Action, action } from 'easy-peasy'

import Folder from '../../typings/folder'

export interface FolderStateModel {
  folders: Folder[]
  create: Action<FolderStateModel, Folder>
  update: Action<FolderStateModel, Folder>
  delete: Action<FolderStateModel, Folder>
}

const folderState: FolderStateModel = {
  folders: [],
  create: action((state, folder) => {
    state.folders = [...state.folders, folder]
  }),
  update: action((state, folder) => {
    const rest = state.folders.filter(f => f.id !== folder.id)
    state.folders = [...rest, folder]
  }),
  delete: action((state, folder) => {
    state.folders = state.folders.filter(f => f.id !== folder.id)
  }),
}

export default folderState
