import React, { useEffect } from 'react'
import generate from 'nanoid/generate'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Note from '../typings/note'

import NoteItem from './NoteItem'

import '../styles/NoteList.scss'

const NoteList = () => {
  const folderId = useStoreState(s => s.selectedState.folderId)
  const folder = useStoreState(s => s.folderState.folders.find(f => f.id === folderId))
  const notes = useStoreState(s => s.noteState.notes)
  const user = useStoreState(s => s.userState.user)

  const updateFolder = useStoreActions(a => a.folderState.update)
  const createNote = useStoreActions(a => a.noteState.create)
  const setNotes = useStoreActions(a => a.noteState.setNotes)
  const setNoteId = useStoreActions(a => a.selectedState.setNoteId)

  useEffect(() => {
    ;(async () => {
      const _notes = folder ? await storage.getNotes(folder.noteIds) : []
      setNotes(_notes)
    })()
  }, [folder, setNotes])

  const handleCreateNote = async () => {
    if (!user || !folder) return

    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const id = generate(alphabet, 13)
    const note: Note = {
      id,
      parent: folder.id,
      owner: user.uid,
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
    }
    setNoteId(note.id)
    createNote(note)
    updateFolder({ ...folder, noteIds: [id, ...folder.noteIds] })
  }

  return folder ? (
    <div className="note-list">
      <h2 className="head">{folder.name}</h2>
      <div className="add-note">
        <Button
          className="btn"
          color="primary"
          onClick={handleCreateNote}
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
