import { deepEqual } from 'fast-equals'

import firestore from '../services/firebase/firestore'
import storage from '../services/storage'
import Folder from '../typings/folder'
import Note from '../typings/note'
import Settings from '../typings/settings'

export async function syncFolder(uid: string, local: Folder): Promise<Folder | null> {
  const remote = await firestore.getFolder(uid, local.id)
  if (!remote) {
    if (await firestore.isRemoved(uid, local.id)) return null
    await firestore.setFolder(uid, local)
  } else if (remote.updatedAt && local.updatedAt) {
    if (new Date(remote.updatedAt) > new Date(local.updatedAt)) return remote
    else if (new Date(remote.updatedAt) < new Date(local.updatedAt)) {
      await firestore.setFolder(uid, local)
    }
  }
  return local
}

export async function syncFolders(uid: string, folders: Folder[]): Promise<Folder[]> {
  const _folders = new Map<string, Folder>()

  const local = await Promise.all(folders.map(f => syncFolder(uid, f)))
  local.filter((f): f is Folder => f !== null).forEach(f => _folders.set(f.id, f))

  // Note: The remote folder items have been synced, but not the FolderIDs
  //       firestore.getFolders() works with FolderIDs not folders
  const remoteFolders = await firestore.getFolders(uid)
  remoteFolders.forEach(remote => {
    if (!_folders.has(remote.id)) _folders.set(remote.id, remote)
    else if (remote.updatedAt) {
      const _local = _folders.get(remote.id)
      if (_local && _local.updatedAt && new Date(_local.updatedAt) < new Date(remote.updatedAt)) {
        _folders.set(remote.id, remote)
      }
    }
  })

  const sortLatest = (a: Folder, b: Folder) =>
    a.updatedAt && b.updatedAt && new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1
  const sorted = [..._folders.values()].sort(sortLatest)

  const rIds = remoteFolders.map(f => f.id)
  const lIds = sorted.map(f => f.id)
  if (!deepEqual(rIds, lIds)) await firestore.setFolderIds(uid, lIds)

  return sorted
}

export async function syncNote(uid: string, nid: string): Promise<Note | null> {
  const local = await storage.getNote(nid)
  const remote = await firestore.getNote(uid, nid)
  if (local && !remote) {
    if (await firestore.isRemoved(uid, nid)) return null
    await firestore.setNote(uid, local)
  } else if (remote && !local) {
    return remote
  } else if (remote && remote.updatedAt && local && local.updatedAt) {
    if (new Date(remote.updatedAt) > new Date(local.updatedAt)) return remote
    else if (new Date(remote.updatedAt) < new Date(local.updatedAt)) {
      await firestore.setNote(uid, local)
    }
  }
  return local
}

export async function syncNotes(uid: string, noteIds: string[]): Promise<Note[]> {
  const notes = await Promise.all(noteIds.map(nid => syncNote(uid, nid)))
  return notes.filter((n): n is Note => n !== null)
}

export async function syncSettings(uid: string, local: Settings): Promise<Settings> {
  const remote = await firestore.getSettings(uid)
  return remote &&
    remote.updatedAt &&
    local.updatedAt &&
    new Date(remote.updatedAt) > new Date(local.updatedAt)
    ? remote
    : local
}

export default {
  syncFolders,
  syncNote,
  syncNotes,
  syncSettings,
}
