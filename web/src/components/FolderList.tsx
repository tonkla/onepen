import React from 'react'
import shortid from 'shortid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import AddIcon from '@material-ui/icons/Add'

import Folder from './Folder'
import FolderType from '../typings/folder'
import { useStoreActions, useStoreState } from '../store'

import '../styles/FolderList.scss'

const FolderList = () => {
  const [isOpen, setOpen] = React.useState(false)
  const [folderName, setFolderName] = React.useState('')
  const createFolder = useStoreActions(actions => actions.folderList.create)
  const folders = useStoreState(state => state.folderList.folders)

  const addFolder = (name: string) => {
    let id = ''
    while (true) {
      id = shortid.generate()
      if (id.indexOf('-') < 0 && id.indexOf('_') < 0) break
    }
    const folder: FolderType = {
      id,
      name,
      parent: '',
      noteIds: [],
    }
    createFolder(folder)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (btn: string) => {
    setOpen(false)
    if (btn === 'add' && folderName.trim() !== '') addFolder(folderName)
    setFolderName('')
  }

  return (
    <div className="folder-list">
      <h2>Folders</h2>
      <div className="add-folder">
        <Button
          className="btn"
          color="primary"
          onClick={handleClickOpen}
          size="small"
          startIcon={<AddIcon />}
          variant="outlined"
        >
          Add Folder
        </Button>
        <Dialog aria-labelledby="form-dialog-title" onClose={handleClose} open={isOpen}>
          <DialogTitle id="form-dialog-title">Add Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              id="folder-name"
              label="Folder Name"
              margin="dense"
              onBlur={e => setFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose('cancel')}>Cancel</Button>
            <Button color="primary" onClick={() => handleClose('add')}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ul>
        {folders.map(folder => (
          <Folder folder={folder} key={folder.id} />
        ))}
      </ul>
    </div>
  )
}

export default FolderList
