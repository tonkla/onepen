import React from 'react'

import { useStoreState } from '../store'

import EditorTitle from './EditorTitle'
import EditorBody from './EditorBody'

import '../styles/Editor.scss'

const Editor = () => {
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const selectedNoteId = useStoreState(state => state.selectedState.noteId)
  const note = {
    parent: selectedFolderId,
    id: selectedNoteId,
    title: '',
    body: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return selectedFolderId && selectedNoteId ? (
    <div className="editor">
      <EditorTitle blankNote={note} />
      <EditorBody blankNote={note} />
    </div>
  ) : (
    <div />
  )
}

export default Editor
