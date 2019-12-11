import React, { useMemo, useState } from 'react'
import { createEditor, Node, Range } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import '../styles/Editor.scss'

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'A line of text in a paragraph.',
        marks: [],
      },
    ],
  },
]

const Editor = () => {
  const [value, setValue] = useState<Node[]>(initialValue)
  const [selection, setSelection] = useState<Range | null>(null)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <div className="editor">
      <Slate
        editor={editor}
        value={value}
        selection={selection}
        onChange={(value: Node[], selection: Range | null) => {
          setValue(value)
          setSelection(selection)
        }}
      >
        <Editable placeholder="Enter some plain text..." />
      </Slate>
    </div>
  )
}

export default Editor
