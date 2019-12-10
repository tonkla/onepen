import React, { useEffect, useMemo, useState } from 'react'
import { createEditor, Node, Range } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import firebase from '../services/firebase/auth'
import router from '../services/router'

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

const Main = () => {
  const [isLoaded, setLoad] = useState(false)
  const [value, setValue] = useState<Node[]>(initialValue)
  const [selection, setSelection] = useState<Range | null>(null)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  useEffect(() => {
    ;(async () => {
      if (await firebase.isSignedIn()) setLoad(true)
      else router.goto('/login')
    })()
  }, [])

  return isLoaded ? (
    <div>
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
  ) : (
    <div>Loading...</div>
  )
}

export default Main
