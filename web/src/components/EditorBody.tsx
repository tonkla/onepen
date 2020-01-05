import React, { useMemo, useState, useEffect } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Note from '../typings/note'

type EditorBodyProps = {
  blankNote: Note
}

const EditorBody = ({ blankNote }: EditorBodyProps) => {
  const editorBody = useMemo(() => withHistory(withReact(createEditor())), [])

  const initialBody = [{ type: 'paragraph', children: [{ text: '' }] }]
  const [body, setBody] = useState<Node[]>(initialBody)
  const [note, setNote] = useState<Note>(blankNote)

  const actionSetNotes = useStoreActions(actions => actions.noteState.setNotes)
  const notes = useStoreState(state => state.noteState.notes)
  const selectedNoteId = useStoreState(state => state.selectedState.noteId)

  useEffect(() => {
    ;(async () => {
      const _note = await storage.getNote(selectedNoteId)
      const __note = _note ? _note : blankNote
      setNote(__note)
      setBody(deserializeMarkdown(__note.body))
    })()
  }, [blankNote, selectedNoteId])

  // TODO: add Markdown support
  const serializeMarkdown = (nodes: Node[]): string => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  // TODO: add Markdown support
  const deserializeMarkdown = (text: string): Node[] => {
    return text.split('\n').map(line => {
      return {
        children: [{ text: line }],
      }
    })
  }

  const [saveNote] = useDebouncedCallback(async (v: Node[]) => {
    const newNote = {
      ...note,
      body: serializeMarkdown(v),
      updatedAt: new Date().toISOString(),
    }
    await storage.setNote(newNote)
    actionSetNotes([newNote, ...notes.filter(n => n.id !== newNote.id)])
  }, 1000)

  return (
    <div className="body">
      <Slate
        editor={editorBody}
        value={body}
        onChange={(v: Node[]) =>
          setBody(prev => {
            if (!deepEqual(prev, v)) saveNote(v)
            return v
          })
        }
      >
        <Editable placeholder="Start writing..." />
      </Slate>
    </div>
  )
}

export default EditorBody
