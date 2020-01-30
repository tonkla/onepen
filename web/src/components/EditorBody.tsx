import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import { useStoreActions, useStoreState } from '../store'

interface EditorBodyProps {
  callback: Function
  isFocusing: boolean
}

const EditorBody = ({ callback, isFocusing }: EditorBodyProps) => {
  const editorBody = useMemo(() => withHistory(withReact(createEditor())), [])

  const initialBody = [{ type: 'paragraph', children: [{ text: '' }] }]
  const [body, setBody] = useState<Node[]>(initialBody)

  const note = useStoreState(s => s.noteState.note)
  const updateNote = useStoreActions(a => a.noteState.update)

  const focusEditor = useCallback(() => {
    if (isFocusing && !ReactEditor.isFocused(editorBody)) {
      ReactEditor.focus(editorBody)
      editorBody.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      }
      callback()
    }
  }, [editorBody, callback, isFocusing])

  useEffect(() => {
    if (note) setBody(deserializeMarkdown(note.body))
    focusEditor()
  }, [note, focusEditor])

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
    if (note) updateNote({ ...note, body: serializeMarkdown(v) })
  }, 1000)

  const s = useStoreState(s => s.settingsState.settings)

  return (
    <div className="body">
      <div
        style={{
          fontFamily: s.fontFamily,
          fontWeight: s.fontWeight,
          fontSize: s.fontSize,
          color: s.fontColor,
          letterSpacing: s.letterSpacing,
          lineHeight: s.lineHeight,
        }}
      >
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
    </div>
  )
}

export default EditorBody
