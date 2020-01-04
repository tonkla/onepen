import React from 'react'

import { useStoreActions } from '../store'
import Note from '../typings/note'

import '../styles/NoteItem.scss'

interface NoteProps {
  note: Note
}

const NoteItem = ({ note }: NoteProps) => {
  const setNoteId = useStoreActions(actions => actions.selectedState.setNoteId)

  const handleClick = (e: any) => {
    setNoteId(e.target.id)
  }

  return (
    <li className="note" id={note.id} key={note.id} onClick={handleClick}>
      {note.title.trim() !== '' ? note.title : 'Untitled'}
    </li>
  )
}

export default NoteItem
