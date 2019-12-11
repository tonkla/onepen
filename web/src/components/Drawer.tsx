import React from 'react'

import NoteList from './NoteList'
import Sidebar from './Sidebar'

import '../styles/Drawer.scss'

const Drawer = () => {
  return (
    <div className="drawer">
      <Sidebar />
      <NoteList />
    </div>
  )
}

export default Drawer
