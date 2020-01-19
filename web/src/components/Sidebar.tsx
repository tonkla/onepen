import React from 'react'

import FolderList from './FolderList'
import Setting from './Setting'

import '../styles/Sidebar.scss'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Setting />
      <FolderList />
    </div>
  )
}

export default Sidebar
