import React from 'react'

import { useStoreActions, useStoreState } from '../store'
import Folder from '../typings/folder'

import '../styles/FolderItem.scss'

interface FolderProps {
  folder: Folder
}

const FolderItem = ({ folder }: FolderProps) => {
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const setFolderId = useStoreActions(actions => actions.selectedState.setFolderId)
  const setNoteId = useStoreActions(actions => actions.selectedState.setNoteId)

  const handleClick = (id: string) => {
    if (id !== selectedFolderId) {
      setFolderId(id)
      setNoteId('')
    }
  }

  return (
    <li className="folder" id={folder.id} key={folder.id} onClick={() => handleClick(folder.id)}>
      {folder.name}
    </li>
  )
}

export default FolderItem
