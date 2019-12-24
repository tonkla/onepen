import React from 'react'

import FolderType from '../typings/folder'

import '../styles/Folder.scss'

interface FolderProps {
  folder: FolderType
}

const Folder = ({ folder }: FolderProps) => {
  return (
    <li className="folder" id={folder.id} key={folder.id}>
      {folder.name}
    </li>
  )
}

export default Folder
