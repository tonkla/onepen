import React from 'react'

import FolderList from './FolderList'
import Setting from './Setting'
import Synchronizer from './Synchronizer'

import '../styles/Sidebar.scss'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Setting />
      <FolderList />
      <Synchronizer />
    </div>
  )
}

export default Sidebar
