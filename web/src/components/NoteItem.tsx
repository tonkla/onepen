import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import { TinyNote } from '../typings/note'

import '../styles/NoteItem.scss'

interface NoteProps {
  note: TinyNote
}

const NoteItem = ({ note }: NoteProps) => {
  const [isOpen, setOpen] = useState(false)
  const [targetNote, setTargetNote] = useState<TinyNote | null>(null)

  const folder = useStoreState(state =>
    targetNote ? state.folderState.folders.find(f => f.id === targetNote.parent) : null
  )
  const actionSetSelectedNoteId = useStoreActions(actions => actions.selectedState.setNoteId)
  const actionDeleteNote = useStoreActions(actions => actions.noteState.deleteNote)
  const actionUpdateFolder = useStoreActions(actions => actions.folderState.update)

  const show = (id: string) => actionSetSelectedNoteId(id)

  const openDialog = (note: TinyNote) => {
    setTargetNote(note)
    setOpen(true)
  }

  const closeDialog = () => setOpen(false)

  const deleteNote = async () => {
    setOpen(false)
    if (targetNote && folder) {
      await storage.removeNote(note)
      actionSetSelectedNoteId('')
      actionDeleteNote(targetNote)
      actionUpdateFolder({ ...folder, noteIds: folder.noteIds.filter(id => id !== targetNote.id) })
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
        <IconButton
          aria-label="delete"
          className="btn-delete"
          onClick={() => openDialog(note)}
          title="Delete"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Dialog aria-labelledby="form-dialog-title" onClose={closeDialog} open={isOpen}>
          <DialogTitle id="form-dialog-title">Delete Note</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {targetNote &&
                `The note "${
                  targetNote.title.trim() !== '' ? targetNote.title : 'Untitled'
                }" will be permanently deleted.`}
              <br /> Are you sure?
            </DialogContentText>
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
