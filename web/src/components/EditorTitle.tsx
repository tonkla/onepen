import React, { useMemo, useState, useEffect } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import Note from '../typings/note'

const initialTitle: Node[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

type EditorTitleProps = {
  note: Note
}

const EditorTitle = ({ note }: EditorTitleProps) => {
  const editorTitle = useMemo(() => withHistory(withReact(createEditor())), [])
  const [title, setTitle] = useState<Node[]>(initialTitle)

  useEffect(() => {
    setTitle(deserializeText(note.title))
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
    await storage.setNote({
      ...note,
      title: serializeText(v),
      updatedAt: new Date().toISOString(),
    })
  }, 1000)

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
