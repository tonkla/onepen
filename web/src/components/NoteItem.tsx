import React from 'react'

import { useStoreActions } from '../store'
import { TinyNote } from '../typings/note'

import '../styles/NoteItem.scss'

interface NoteProps {
  note: TinyNote
}

const NoteItem = ({ note }: NoteProps) => {
  const setNoteId = useStoreActions(actions => actions.selectedState.setNoteId)

  const handleClick = (id: string) => setNoteId(id)

  return (
    <li className="note" id={note.id} key={note.id} onClick={() => handleClick(note.id)}>
      <div className="title">
        <span>{note.title.trim() !== '' ? note.title : 'Untitled'}</span>
      </div>
      <div className="updated">
        <span>Updated: {note.updatedAt}</span>
      </div>
    </li>
  )
}

export default NoteItem
