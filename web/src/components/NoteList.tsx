import React, { useEffect } from 'react'
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
  const setSelectedNoteId = useStoreActions(actions => actions.selectedState.setNoteId)

  const notes = useStoreState(state => state.noteState.notes)
  const setNotes = useStoreActions(actions => actions.noteState.setNotes)

  useEffect(() => {
    ;(async () => {
      const _notes = folder ? await storage.findNotesByIds(folder.noteIds) : []
      setNotes(_notes)
    })()
  }, [folder, setNotes])

  const handleClickAddNote = async () => {
    if (!folder) return

    let id = ''
    while (true) {
      id = shortid.generate()
      if (id.indexOf('-') < 0 && id.indexOf('_') < 0) break
    }
    const note: Note = {
      parent: folder.id,
      id,
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    // First, save note in localStorage
    await storage.setNote(note)
    // Then update the editor UI state
    setSelectedNoteId(id)

    // Second, add the new note ID into parent folder
    folder.noteIds.push(id)
    updateFolder(folder)
    // Then update the notes list UI state
    setNotes([note, ...notes])
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
