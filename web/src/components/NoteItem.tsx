import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import { TinyNote } from '../typings/note'

import '../styles/NoteItem.scss'

interface NoteProps {
  note: TinyNote
}

const NoteItem = ({ note }: NoteProps) => {
  const [isOpen, setOpen] = useState(false)
  const [code, setCode] = useState('')

  const folder = useStoreState(s => s.folderState.folders.find(f => f.id === note.parent))
  const actionSetSelectedNoteId = useStoreActions(a => a.selectedState.setNoteId)
  const actionDeleteNote = useStoreActions(a => a.noteState.deleteNote)
  const actionUpdateFolder = useStoreActions(a => a.folderState.update)

  const show = (id: string) => actionSetSelectedNoteId(id)

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  const deleteNote = async () => {
    setOpen(false)
    if (note && folder && code.trim() === 'nopen') {
      await storage.delNote(note.id)
      actionSetSelectedNoteId('')
      actionDeleteNote(note)
      actionUpdateFolder({ ...folder, noteIds: folder.noteIds.filter(id => id !== note.id) })
    }
  }

  return (
    <li className="note" id={note.id} key={note.id}>
      <div className="left-pane" onClick={() => show(note.id)}>
        <div className="title">
          <span>{note.title.trim() !== '' ? note.title : 'Untitled'}</span>
        </div>
        <div className="updated">
          <span>Updated: {note.updatedAt}</span>
        </div>
      </div>
      <div className="right-pane">
        <IconButton aria-label="delete" className="btn-delete" onClick={openDialog} title="Delete">
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Dialog aria-labelledby="dialog-delete-note" onClose={closeDialog} open={isOpen}>
          <DialogTitle id="dialog-delete-note">Delete Note</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`The note "${
                note.title.trim() !== '' ? note.title : 'Untitled'
              }" will be permanently deleted.`}
              <br /> Please type "nopen" to confirm deleting.
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              id="confirmation-code"
              label="Confirmation Code"
              margin="dense"
              onBlur={e => setCode(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button color="primary" onClick={deleteNote}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </li>
  )
}

export default NoteItem
