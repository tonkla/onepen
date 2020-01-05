import React, { useMemo, useState, useEffect } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Note from '../typings/note'

type EditorTitleProps = {
  blankNote: Note
}

const EditorTitle = ({ blankNote }: EditorTitleProps) => {
  const editorTitle = useMemo(() => withHistory(withReact(createEditor())), [])

  const initialTitle = [{ type: 'paragraph', children: [{ text: '' }] }]
  const [title, setTitle] = useState<Node[]>(initialTitle)
  const [note, setNote] = useState<Note>(blankNote)

  const actionSetNotes = useStoreActions(actions => actions.noteState.setNotes)
  const notes = useStoreState(state => state.noteState.notes)
  const selectedNoteId = useStoreState(state => state.selectedState.noteId)

  useEffect(() => {
    ;(async () => {
      const _note = await storage.getNote(selectedNoteId)
      const __note = _note ? _note : blankNote
      setNote(__note)
      setTitle(deserializeText(__note.title))
    })()
  }, [blankNote, selectedNoteId])

  const serializeText = (nodes: Node[]): string => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  const deserializeText = (text: string): Node[] => {
    return text.split('\n').map(line => {
      return {
        children: [{ text: line }],
      }
    })
  }

  const [saveNote] = useDebouncedCallback(async (v: Node[]) => {
    const newNote = {
      ...note,
      title: serializeText(v),
      updatedAt: new Date().toISOString(),
    }
    await storage.setNote(newNote)
    actionSetNotes([newNote, ...notes.filter(n => n.id !== newNote.id)])
  }, 300)

  return (
    <div className="title">
      <Slate
        editor={editorTitle}
        value={title}
        onChange={(v: Node[]) =>
          setTitle(prev => {
            if (!deepEqual(prev, v)) saveNote(v)
            return v
          })
        }
      >
        <Editable placeholder="Untitled" />
      </Slate>
    </div>
  )
}

export default EditorTitle
