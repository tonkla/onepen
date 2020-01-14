import React from 'react'
import shortid from 'shortid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import AddIcon from '@material-ui/icons/Add'

import { useStoreActions, useStoreState } from '../store'
import Folder from '../typings/folder'

import FolderItem from './FolderItem'

import '../styles/FolderList.scss'

const FolderList = () => {
  const [isOpenDialog, setOpenDialog] = React.useState(false)
  const [folderName, setFolderName] = React.useState('')

  const createFolder = useStoreActions(actions => actions.folderState.create)
  const folders = useStoreState(state => state.folderState.folders)

  const addFolder = (name: string) => {
    let id = ''
    while (true) {
      id = shortid.generate()
      if (id.indexOf('-') < 0 && id.indexOf('_') < 0) break
    }
    const folder: Folder = {
      id,
      name,
      parent: '',
      noteIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    createFolder(folder)
  }

  const handleAddFolder = () => {
    handleCloseDialog()
    if (folderName.trim() !== '') addFolder(folderName.trim())
    setFolderName('')
  }

  const handleCloseDialog = () => setOpenDialog(false)

  return (
    <div className="folder-list">
      <h2 className="head">Folders</h2>
      <div className="add-folder">
        <Button
          className="btn"
          color="primary"
          onClick={() => setOpenDialog(true)}
          size="small"
          startIcon={<AddIcon />}
          variant="outlined"
        >
          Add Folder
        </Button>
        <Dialog aria-labelledby="dialog-add-folder" onClose={handleCloseDialog} open={isOpenDialog}>
          <DialogTitle id="dialog-add-folder">Add Folder</DialogTitle>
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button color="primary" onClick={handleAddFolder}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ul>
        {folders.map(folder => (
          <FolderItem folder={folder} key={folder.id} />
        ))}
      </ul>
    </div>
  )
}

export default FolderList
