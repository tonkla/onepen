import React, { useEffect, useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'

const EditorTitle = () => {
  const editorTitle = useMemo(() => withHistory(withReact(createEditor())), [])

  const initialTitle = [{ type: 'paragraph', children: [{ text: '' }] }]
  const [title, setTitle] = useState<Node[]>(initialTitle)

  const note = useStoreState(state => state.noteState.note)
  const actionUpdateNote = useStoreActions(actions => actions.noteState.updateNote)

  useEffect(() => {
    if (note) setTitle(deserializeText(note.title))
  }, [note])

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
    if (note) {
      const newNote = {
        ...note,
        title: serializeText(v),
        updatedAt: new Date().toISOString(),
      }
      actionUpdateNote(newNote)
      await storage.setNote(newNote)
    }
  }, 500)

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
