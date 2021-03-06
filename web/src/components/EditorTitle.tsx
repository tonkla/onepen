import React, { useEffect, useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import { useStoreActions, useStoreState } from '../store'

interface EditorTitleProps {
  callback: Function
}

const EditorTitle = ({ callback }: EditorTitleProps) => {
  const editorTitle = useMemo(() => withHistory(withReact(createEditor())), [])

  const initialTitle = [{ type: 'paragraph', children: [{ text: '' }] }]
  const [title, setTitle] = useState<Node[]>(initialTitle)

  const note = useStoreState(s => s.noteState.note)
  const updateNote = useStoreActions(a => a.noteState.update)

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
    if (note) updateNote({ ...note, title: serializeText(v) })
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
        <Editable
          placeholder="Untitled"
          onKeyDown={event => {
            if (event.keyCode === 13) {
              event.preventDefault()
              callback()
            }
          }}
        />
      </Slate>
    </div>
  )
}

export default EditorTitle
