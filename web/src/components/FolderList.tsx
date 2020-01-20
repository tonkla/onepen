import React from 'react'
import generate from 'nanoid/generate'
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

  const folders = useStoreState(s => s.folderState.folders)
  const user = useStoreState(s => s.userState.user)

  const createFolder = useStoreActions(a => a.folderState.create)
  const setFolderId = useStoreActions(a => a.selectedState.setFolderId)

  const handleCloseDialog = () => setOpenDialog(false)

  const handleCreateFolder = () => {
    handleCloseDialog()
    if (user && folderName.trim() !== '') {
      const folder: Folder = {
        id: generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10),
        name: folderName.trim(),
        parent: '',
        owner: user.uid,
        noteIds: [],
        createdAt: new Date().toISOString(),
      }
      createFolder(folder)
      setFolderId(folder.id)
    }
    setFolderName('')
  }

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
            <Button color="primary" onClick={handleCreateFolder}>
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
