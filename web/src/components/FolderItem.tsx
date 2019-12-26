import React from 'react'

import { useStoreActions } from '../store'
import Folder from '../typings/folder'

import '../styles/FolderItem.scss'

interface FolderProps {
  folder: Folder
}

const FolderItem = ({ folder }: FolderProps) => {
  const setFolderId = useStoreActions(actions => actions.selectedState.setFolderId)

  const handleClick = (e: any) => {
    setFolderId(e.target.id)
  }

  return (
    <li className="folder" id={folder.id} key={folder.id} onClick={handleClick}>
      {folder.name}
    </li>
  )
}

export default FolderItem
