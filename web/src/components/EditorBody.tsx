import React, { useMemo, useState, useEffect } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import Note from '../typings/note'

const initialBody: Node[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

type EditorBodyProps = {
  note: Note
}

const EditorBody = ({ note }: EditorBodyProps) => {
  const editorBody = useMemo(() => withHistory(withReact(createEditor())), [])
  const [body, setBody] = useState<Node[]>(initialBody)

  useEffect(() => {
    setBody(deserializeMarkdown(note.body))
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
    await storage.setNote({
      ...note,
      body: serializeMarkdown(v),
      updatedAt: new Date().toISOString(),
    })
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
