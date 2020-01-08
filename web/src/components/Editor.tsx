import React, { useEffect } from 'react'
import { HeadProvider, Link } from 'react-head'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Note from '../typings/note'

import EditorTitle from './EditorTitle'
import EditorBody from './EditorBody'

import '../styles/Editor.scss'

const Editor = () => {
  const [isFocusing, setFocus] = React.useState(false)

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

  const s = useStoreState(state => state.settingsState.settings)
  const googleFonts = `https://fonts.googleapis.com/css?family=${s.fontFamily}:${s.fontWeight}`

  return selectedFolderId && selectedNoteId ? (
    <div className="editor">
      <HeadProvider>
        <Link rel="stylesheet" href={googleFonts} />
      </HeadProvider>
      <div style={{ fontFamily: s.fontFamily, fontWeight: s.fontWeight }}>
        <EditorTitle callback={() => setFocus(true)} />
        <EditorBody callback={() => setFocus(false)} isFocusing={isFocusing} />
      </div>
    </div>
  ) : (
    <div />
  )
}

export default Editor
