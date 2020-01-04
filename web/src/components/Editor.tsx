import React, { useEffect, useState } from 'react'

import storage from '../services/storage'
import { useStoreState } from '../store'
import Note from '../typings/note'

import EditorTitle from './EditorTitle'
import EditorBody from './EditorBody'

import '../styles/Editor.scss'

const Editor = () => {
  const [note, setNote] = useState<Note | null>(null)
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const selectedNoteId = useStoreState(state => state.selectedState.noteId)

  useEffect(() => {
    ;(async () => {
      const note = await storage.getNote(selectedNoteId)
      note
        ? setNote(note)
        : setNote({
            parent: selectedFolderId,
            id: selectedNoteId,
            title: '',
            body: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
    })()
  }, [selectedFolderId, selectedNoteId])

  return selectedNoteId && note ? (
    <div className="editor">
      <EditorTitle note={note} />
      <EditorBody note={note} />
    </div>
  ) : (
    <div />
  )
}

export default Editor
