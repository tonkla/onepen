import React, { useEffect } from 'react'
import { HeadProvider, Link } from 'react-head'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'

import EditorTitle from './EditorTitle'
import EditorBody from './EditorBody'

import '../styles/Editor.scss'

const Editor = () => {
  const [isFocusing, setFocus] = React.useState(false)

  const folderId = useStoreState(s => s.selectedState.folderId)
  const noteId = useStoreState(s => s.selectedState.noteId)

  const setNote = useStoreActions(a => a.noteState.setNote)

  useEffect(() => {
    ;(async () => {
      const note = await storage.getNote(noteId)
      if (note) setNote(note)
    })()
  }, [noteId, setNote])

  const s = useStoreState(s => s.settingsState.settings)
  const googleFonts = `https://fonts.googleapis.com/css?family=${s.fontFamily}:${s.fontWeight}`

  return folderId && noteId ? (
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
