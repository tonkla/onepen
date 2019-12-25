import React from 'react'

import { useStoreState } from '../store'

import NoteList from './NoteList'
import Sidebar from './Sidebar'

import '../styles/Drawer.scss'

const Drawer = () => {
  const selectedFolderId = useStoreState(state => state.selected.folderId)

  return (
    <div className="drawer">
      <Sidebar />
      {selectedFolderId && <NoteList />}
    </div>
  )
}

export default Drawer
