import { Action, action, Thunk, thunk } from 'easy-peasy'

import firestore from '../../services/firebase/firestore'
import storage from '../../services/storage'
import Folder from '../../typings/folder'

export interface FolderStateModel {
  folders: Folder[]
  create: Thunk<FolderStateModel, Folder>
  update: Thunk<FolderStateModel, Folder>
  delete: Thunk<FolderStateModel, Folder>
  _create: Action<FolderStateModel, Folder>
  _update: Action<FolderStateModel, Folder>
  _delete: Action<FolderStateModel, Folder>
  setFolders: Action<FolderStateModel, Folder[]>
}

const folderState: FolderStateModel = {
  folders: [],
  create: thunk(async (actions, folder, { getState }) => {
    const { folders } = getState()
    const _f = { ...folder, updatedAt: new Date().toISOString() }
    actions._create(_f)
    await firestore.setFolder(_f.owner, _f)
    await firestore.setFolderIds(_f.owner, [_f.id, ...folders.map(f => f.id)])
  }),
  update: thunk(async (actions, folder) => {
    const _f = { ...folder, updatedAt: new Date().toISOString() }
    actions._update(_f)
    await firestore.setFolder(_f.owner, _f)
  }),
  delete: thunk(async (actions, folder, { getState }) => {
    const { folders } = getState()
    const _f = { ...folder, updatedAt: new Date().toISOString() }
    actions._delete(_f)
    await Promise.all(folder.noteIds.map(id => storage.delNote(id)))
    await Promise.all(folder.noteIds.map(id => firestore.delNote(folder.owner, id)))
    await firestore.delFolder(_f.owner, _f)
    await firestore.setFolderIds(
      _f.owner,
      folders.map(f => f.id).filter(id => id !== _f.id)
    )
  }),
  _create: action((state, folder) => {
    state.folders = [folder, ...state.folders]
  }),
  _update: action((state, folder) => {
    const rest = state.folders.filter(f => f.id !== folder.id)
    state.folders = [folder, ...rest]
  }),
  _delete: action((state, folder) => {
    state.folders = state.folders.filter(f => f.id !== folder.id)
  }),
  setFolders: action((state, folders) => {
    state.folders = folders
  }),
}

export default folderState
