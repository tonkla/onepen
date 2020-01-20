import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'

import synchronizer from '../services/synchronizer'
import { useStoreActions, useStoreState } from '../store'

const Synchronizer = () => {
  const folderId = useStoreState(s => s.selectedState.folderId)
  const noteId = useStoreState(s => s.selectedState.noteId)
  const folders = useStoreState(s => s.folderState.folders)
  const settings = useStoreState(s => s.settingsState.settings)
  const user = useStoreState(s => s.userState.user)
  const folder = folders.find(f => f.id === folderId)

  const setFolders = useStoreActions(a => a.folderState.setFolders)
  const setNotes = useStoreActions(a => a.noteState.setNotes)
  const setNote = useStoreActions(a => a.noteState.setNote)
  const setSettings = useStoreActions(a => a.settingsState.set)

  useEffect(() => {
    ;(async () => {
      if (!user) return
      if (folder) setNotes(await synchronizer.syncNotes(user.uid, folder.noteIds))
      const note = await synchronizer.syncNote(user.uid, noteId)
      if (note) setNote(note)
    })()
  }, [user, folder, noteId, setNotes, setNote])

  async function sync() {
    if (!user) return
    setFolders(await synchronizer.syncFolders(user.uid, folders))
    if (folder) setNotes(await synchronizer.syncNotes(user.uid, folder.noteIds))
    const note = await synchronizer.syncNote(user.uid, noteId)
    if (note) setNote(note)
    setSettings(await synchronizer.syncSettings(user.uid, settings))
  }

  return (
    <div style={{ alignSelf: 'center', marginTop: 30 }}>
      <Button className="btn" onClick={sync} size="small">
        Sync
      </Button>
    </div>
  )
}

export default Synchronizer
