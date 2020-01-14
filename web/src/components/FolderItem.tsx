import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Folder from '../typings/folder'

import '../styles/FolderItem.scss'

interface FolderProps {
  folder: Folder
}

const FolderItem = ({ folder }: FolderProps) => {
  const selectedFolderId = useStoreState(state => state.selectedState.folderId)
  const setFolderId = useStoreActions(actions => actions.selectedState.setFolderId)
  const setNoteId = useStoreActions(actions => actions.selectedState.setNoteId)
  const updateFolder = useStoreActions(actions => actions.folderState.update)
  const deleteFolder = useStoreActions(actions => actions.folderState.delete)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isOpenDialogDelete, setOpenDialogDelete] = useState(false)
  const [isOpenDialogRename, setOpenDialogRename] = useState(false)
  const [folderName, setFolderName] = useState('')

  const handleClick = (id: string) => {
    if (id !== selectedFolderId) {
      setFolderId(id)
      setNoteId('')
    }
  }

  const handleClickSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDialog = () => {
    setOpenDialogDelete(false)
    setOpenDialogRename(false)
    setAnchorEl(null)
    setFolderName('')
  }

  const handleRename = () => {
    if (folder && folderName.trim() !== '' && folderName !== folder.name) {
      updateFolder({ ...folder, name: folderName.trim() })
    }
    handleCloseDialog()
  }

  const handleDelete = async () => {
    if (folder && folder.name === folderName) {
      await Promise.all(folder.noteIds.map(id => storage.delNote(id)))
      if (folder.id === selectedFolderId) {
        setFolderId('')
        setNoteId('')
      }
      // First, finish all child component states
      handleCloseDialog()
      // Then update parent component states
      deleteFolder(folder)
      // Throw the folder to a trash
      await storage.remove(folder)
    }
    // Note: don't remove `else`
    else handleCloseDialog()
  }

  return (
    <li className="folder" id={folder.id} key={folder.id}>
      <div className="left-pane" onClick={() => handleClick(folder.id)}>
        <div className="title">
          <span>{folder.name}</span>
        </div>
      </div>
      <div className="right-pane">
        <IconButton
          aria-label="folder-settings"
          className="btn-folder-settings"
          onClick={handleClickSettings}
          title="Folder Settings"
        >
          <MoreHoriz fontSize="small" />
        </IconButton>

        <Menu
          id="folder-settings-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseDialog}
        >
          <MenuItem onClick={() => setOpenDialogRename(true)}>Rename</MenuItem>
          <MenuItem onClick={() => setOpenDialogDelete(true)}>Delete</MenuItem>
        </Menu>

        <Dialog
          aria-labelledby="dialog-rename-folder"
          onClose={handleCloseDialog}
          open={isOpenDialogRename}
        >
          <DialogTitle id="dialog-rename-folder">Rename Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              id="folder-name-rename"
              label="Folder Name"
              margin="dense"
              onBlur={e => setFolderName(e.target.value)}
              defaultValue={folder.name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button color="primary" onClick={handleRename}>
              Rename
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          aria-labelledby="dialog-delete-folder"
          onClose={() => setOpenDialogDelete(true)}
          open={isOpenDialogDelete}
        >
          <DialogTitle id="dialog-delete-folder">Delete Note</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`The folder "${folder.name}" and its notes will be permanently deleted.`}
              <br /> Please type the folder name to confirm deleting.
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              id="folder-name-delete"
              label="Folder Name"
              margin="dense"
              onBlur={e => setFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button color="primary" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </li>
  )
}

export default FolderItem
