import React, { useEffect } from 'react'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Note from '../typings/note'

import EditorTitle from './EditorTitle'
import EditorBody from './EditorBody'

import '../styles/Editor.scss'

const Editor = () => {
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const selectedNoteId = useStoreState(state => state.selectedState.noteId)

  const actionSetNote = useStoreActions(actions => actions.noteState.setNote)

  const blankNote: Note = {
    parent: selectedFolderId,
    id: selectedNoteId,
    title: '',
    body: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  useEffect(() => {
    ;(async () => {
      const note = await storage.getNote(blankNote.id)
      actionSetNote(note || blankNote)
    })()
  }, [blankNote, actionSetNote])

  return selectedFolderId && selectedNoteId ? (
    <div className="editor">
      <EditorTitle />
      <EditorBody />
    </div>
  ) : (
    <div />
  )
}

export default Editor
