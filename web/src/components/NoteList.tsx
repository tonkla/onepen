import React from 'react'
import shortid from 'shortid'

import Note from './Note'

import '../styles/NoteList.scss'

const addNote = () => {
  const id = shortid.generate()
  console.log(id)
}

const NoteList = () => {
  return (
    <div className="note-list">
      <h2>Notes</h2>
      <div onClick={addNote}>Add Note</div>
      <ul>
        <Note />
      </ul>
    </div>
  )
}

export default NoteList
