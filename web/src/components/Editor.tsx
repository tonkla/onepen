import React, { useEffect, useMemo, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { deepEqual } from 'fast-equals'
import { useDebouncedCallback } from 'use-debounce'

import storage from '../services/storage'
import { useStoreState } from '../store'
import Note from '../typings/note'

import '../styles/Editor.scss'

// Note: 'useState<Node[]>' needs separated array
const initialTitle: Node[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]
const initialBody: Node[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

const Editor = () => {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState<Node[]>(initialTitle)
  const [body, setBody] = useState<Node[]>(initialBody)

  const [prevTitle, setPrevTitle] = useState<Node[] | null>(null)
  const [prevBody, setPrevBody] = useState<Node[] | null>(null)

  const editorTitle = useMemo(() => withHistory(withReact(createEditor())), [])
  const editorBody = useMemo(() => withHistory(withReact(createEditor())), [])

  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const selectedNoteId = useStoreState(state => state.selectedState.noteId)

  useEffect(() => {
    ;(async () => {
      const note = await storage.getNote(selectedNoteId)
      if (note) {
        setNote(note)
        setTitle(deserializeText(note.title))
        setBody(deserializeMarkdown(note.body))
      } else {
        setNote({
          parent: selectedFolderId,
          id: selectedNoteId,
          title: '',
          body: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    })()
  }, [selectedFolderId, selectedNoteId])

  const _saveNote = async () => {
    if (selectedFolderId.trim() === '' || selectedNoteId.trim() === '' || !note) return

    if (!deepEqual(title, prevTitle)) {
      setPrevTitle(title)
      await storage.setNote({
        ...note,
        title: serializeText(title),
        updatedAt: new Date().toISOString(),
      })
    }
    if (!deepEqual(body, prevBody)) {
      setPrevBody(body)
      await storage.setNote({
        ...note,
        body: serializeMarkdown(body),
        updatedAt: new Date().toISOString(),
      })
    }
  }
  const [saveNote] = useDebouncedCallback(() => _saveNote(), 2000)

  const serializeText = (nodes: Node[]): string => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  // TODO:
  const serializeMarkdown = (nodes: Node[]): string => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  const deserializeText = (text: string): Node[] => {
    return text.split('\n').map(line => {
      return {
        children: [{ text: line }],
      }
    })
  }

  // TODO:
  const deserializeMarkdown = (text: string): Node[] => {
    return text.split('\n').map(line => {
      return {
        children: [{ text: line }],
      }
    })
  }

  return selectedNoteId ? (
    <div className="editor">
      <div className="title">
        <Slate
          editor={editorTitle}
          value={title}
          onChange={(value: Node[]) => {
            setTitle(value)
            saveNote()
          }}
        >
          <Editable placeholder="Title" />
        </Slate>
      </div>
      <div className="body">
        <Slate
          editor={editorBody}
          value={body}
          onChange={(value: Node[]) => {
            setBody(value)
            saveNote()
          }}
        >
          <Editable placeholder="Start writing..." />
        </Slate>
      </div>
    </div>
  ) : (
    <div />
  )
}

export default Editor
