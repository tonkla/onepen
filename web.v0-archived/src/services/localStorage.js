import localforage from 'localforage'

import {
  KEY_NOTE,
  KEY_NOTEBOOK,
  KEY_WORKING_NOTE,
  KEY_WORKING_NOTEBOOK,
  KEY_TRASH,
  KEY_SYNC_ITEMS,
} from '../constants'

localforage.config({ name: 'onepen', storeName: 'notebooks' })

export const LocalStorage = {
  getItem: async key => {
    return await localforage.getItem(key)
  },
  setItem: async (key, value) => {
    return await localforage.setItem(key, value)
  },
  removeItem: async key => {
    return await localforage.removeItem(key)
  },
  keys: async () => {
    return await localforage.keys()
  },
  clear: async () => {
    return await localforage.clear()
  },

  getNote: async id => {
    const key = `${KEY_NOTE}${id}`
    return await LocalStorage.getItem(key)
  },
  setNote: async note => {
    const key = `${KEY_NOTE}${note.id}`
    return await LocalStorage.setItem(key, note)
  },
  removeNote: async id => {
    const key = `${KEY_NOTE}${id}`
    return await LocalStorage.removeItem(key)
  },

  getNotebook: async id => {
    const key = `${KEY_NOTEBOOK}${id}`
    return await LocalStorage.getItem(key)
  },
  setNotebook: async notebook => {
    const key = `${KEY_NOTEBOOK}${notebook.id}`
    return await LocalStorage.setItem(key, notebook)
  },
  removeNotebook: async notebook => {
    const key = `${KEY_NOTEBOOK}${notebook.id}`
    return await LocalStorage.removeItem(key)
  },
  getNotebooks: async () => {
    const keys = await LocalStorage.keys()
    return await Promise.all(
      keys
        .filter(key => key.indexOf(KEY_NOTEBOOK) === 0)
        .map(async key => await LocalStorage.getItem(key))
    )
  },
  setNotebooks: async notebooks => {
    return await Promise.all(
      notebooks.map(async notebook => await LocalStorage.setNotebook(notebook))
    )
  },

  getWorkingNoteId: async () => {
    return await LocalStorage.getItem(KEY_WORKING_NOTE)
  },
  setWorkingNoteId: async note => {
    return await LocalStorage.setItem(KEY_WORKING_NOTE, note)
  },
  removeWorkingNoteId: async () => {
    return await LocalStorage.removeItem(KEY_WORKING_NOTE)
  },

  getWorkingNotebookId: async () => {
    return await LocalStorage.getItem(KEY_WORKING_NOTEBOOK)
  },
  setWorkingNotebookId: async notebook => {
    return await LocalStorage.setItem(KEY_WORKING_NOTEBOOK, notebook)
  },
  removeWorkingNotebookId: async () => {
    return await LocalStorage.removeItem(KEY_WORKING_NOTEBOOK)
  },

  getTrash: async () => {
    return await LocalStorage.getItem(KEY_TRASH)
  },
  setTrash: async trash => {
    return await LocalStorage.setItem(KEY_TRASH, trash)
  },

  getSyncItems: async () => {
    return await LocalStorage.getItem(KEY_SYNC_ITEMS)
  },
  setSyncItems: async items => {
    return await LocalStorage.setItem(KEY_SYNC_ITEMS, items)
  },
  removeSyncItems: async () => {
    return await LocalStorage.removeItem(KEY_SYNC_ITEMS)
  },
}
