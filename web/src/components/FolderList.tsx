import React from 'react'
import shortid from 'shortid'

import Folder from './Folder'

import '../styles/FolderList.scss'

const addFolder = () => {
  const id = shortid.generate()
  console.log(id)
}

const FolderList = () => {
  return (
    <div className="folder-list">
      <h2>Folders</h2>
      <div onClick={addFolder}>Add Folder</div>
      <ul>
        <Folder />
      </ul>
    </div>
  )
}

export default FolderList
