import React from 'react'

import Folder from './Folder'

import '../styles/FolderList.scss'

const FolderList = () => {
  return (
    <div className="folder-list">
      <h2>Folders</h2>
      <div>Create Folder</div>
      <ul>
        <Folder />
      </ul>
    </div>
  )
}

export default FolderList
