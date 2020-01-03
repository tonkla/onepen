import React, { useEffect, useState } from 'react'
import shortid from 'shortid'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Note from '../typings/note'

import NoteItem from './NoteItem'

import '../styles/NoteList.scss'

const NoteList = () => {
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const folder = useStoreState(state =>
    state.folderState.folders.find(f => f.id === selectedFolderId)
  )
  const updateFolder = useStoreActions(actions => actions.folderState.update)
  const createNote = useStoreActions(actions => actions.noteState.create)

  const [notes, setNotes] = useState<Note[]>([])
  useEffect(() => {
    ;(async () => {
      const _notes = folder ? await storage.findNotesByIds(folder.noteIds) : []
      setNotes(_notes)
    })()
  }, [folder])

  const handleClickAddNote = () => {
    if (!folder) return

    let id = ''
    while (true) {
      id = shortid.generate()
      if (id.indexOf('-') < 0 && id.indexOf('_') < 0) break
    }
    const note: Note = {
      id,
      title: 'Untitled',
      body: '',
      parent: folder.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    createNote(note)

    folder.noteIds.push(note.id)
    updateFolder(folder)

    // Update UI
    setNotes([...notes, note])
  }

  return folder ? (
    <div className="note-list">
      <h2>{folder.name}</h2>
      <div className="add-note">
        <Button
          className="btn"
          color="primary"
          onClick={handleClickAddNote}
          size="small"
          startIcon={<AddIcon />}
          variant="outlined"
        >
          Add Note
        </Button>
      </div>
      <ul>
        {notes.map(note => (
          <NoteItem note={note} key={note.id} />
        ))}
      </ul>
    </div>
  ) : (
    <div />
  )
}

export default NoteList
