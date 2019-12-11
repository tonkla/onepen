import React from 'react'

import Note from './Note'

import '../styles/NoteList.scss'

const NoteList = () => {
  return (
    <div className="note-list">
      <h2>Notes</h2>
      <div>Create Note</div>
      <ul>
        <Note />
      </ul>
    </div>
  )
}

export default NoteList
