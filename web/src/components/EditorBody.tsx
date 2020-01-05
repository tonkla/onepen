import React, { useEffect, useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'

const EditorBody = () => {
  const editorBody = useMemo(() => withHistory(withReact(createEditor())), [])

  const initialBody = [{ type: 'paragraph', children: [{ text: '' }] }]
  const [body, setBody] = useState<Node[]>(initialBody)

  const note = useStoreState(state => state.noteState.note)
  const actionUpdateNote = useStoreActions(actions => actions.noteState.updateNote)

  useEffect(() => {
    if (note) setBody(deserializeMarkdown(note.body))
  }, [note])

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
    if (note) {
      const newNote = {
        ...note,
        body: serializeMarkdown(v),
        updatedAt: new Date().toISOString(),
      }
      actionUpdateNote(newNote)
      await storage.setNote(newNote)
    }
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
