import { Action, action } from 'easy-peasy'

import Folder from '../../typings/folder'

export interface FolderStateModel {
  folders: Folder[]
  updatedAt: string
  create: Action<FolderStateModel, Folder>
  update: Action<FolderStateModel, Folder>
  delete: Action<FolderStateModel, Folder>
}

const folderState: FolderStateModel = {
  folders: [],
  updatedAt: '',
  create: action((state, folder) => {
    state.folders = [folder, ...state.folders]
    state.updatedAt = new Date().toISOString()
  }),
  update: action((state, folder) => {
    const rest = state.folders.filter(f => f.id !== folder.id)
    state.folders = [folder, ...rest]
    state.updatedAt = new Date().toISOString()
  }),
  delete: action((state, folder) => {
    state.folders = state.folders.filter(f => f.id !== folder.id)
    state.updatedAt = new Date().toISOString()
  }),
}

export default folderState
