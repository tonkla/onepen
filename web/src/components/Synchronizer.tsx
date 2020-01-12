import React from 'react'

import synchronizer from '../services/synchronizer'
import { useStoreState } from '../store'

const Synchronizer = () => {
  const user = useStoreState(state => state.userState.user)
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const folder = useStoreState(state =>
    state.folderState.folders.find(f => f.id === selectedFolderId)
  )

  async function sync() {
    if (!user || !folder) return
    await synchronizer.syncNotes(user, folder.noteIds)
    await synchronizer.syncStates(user)
  }

  return (
    <div style={{ alignSelf: 'center', marginTop: 30 }}>
      <button onClick={sync} style={{ width: 100 }}>
        Sync
      </button>
    </div>
  )
}

export default Synchronizer
