import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import SettingIcon from '@material-ui/icons/Settings'

import firebase from '../services/firebase/auth'
import router from '../services/router'
import storage from '../services/storage'

import Profile from './Profile'
import '../styles/Setting.scss'

const Setting = () => {
  const [isOpenDialogPreference, setOpenDialogPreference] = useState(false)
  const [isOpenDialogLogout, setOpenDialogLogout] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [prefFont, setPrefFont] = useState('')

  const handleCloseDialog = () => {
    setOpenDialogPreference(false)
    setOpenDialogLogout(false)
    setAnchorEl(null)
  }

  const handleOpenDialogPreference = () => {
    setOpenDialogPreference(true)
  }

  const handleOpenDialogLogout = () => {
    setOpenDialogLogout(true)
  }

  const handleSavePreference = () => {
    handleCloseDialog()
    if (prefFont.trim() !== '') {
      // save
    }
  }

  const handleLogout = async () => {
    handleCloseDialog()
    storage.clear()
    await firebase.signOut()
    router.goto('/login')
  }

  return (
    <div className="setting">
      <Profile />

      <IconButton
        aria-label="setting"
        className="btn-setting"
        onClick={e => setAnchorEl(e.currentTarget)}
        title="Settings"
      >
        <SettingIcon fontSize="small" />
      </IconButton>

      <Popover
        id="menu-setting"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseDialog}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>
          <MenuItem onClick={handleOpenDialogPreference}>Preferences</MenuItem>
          <MenuItem onClick={handleOpenDialogLogout}>Logout</MenuItem>
        </MenuList>
      </Popover>

      <Dialog
        aria-labelledby="dialog-preference"
        onClose={handleCloseDialog}
        open={isOpenDialogPreference}
      >
        <DialogTitle id="dialog-preference">Preferences</DialogTitle>
        <DialogContent>
          <DialogContentText>Google Fonts</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="pref-fonts"
            label="Fonts"
            margin="dense"
            defaultValue={prefFont}
            onBlur={e => setPrefFont(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="primary" onClick={handleSavePreference}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        aria-labelledby="dialog-confirm-logout"
        onClose={handleCloseDialog}
        open={isOpenDialogLogout}
      >
        <DialogTitle id="dialog-confirm-logout">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All of your contents on this device will be removed.
            <br /> Do you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="primary" onClick={handleLogout}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Setting
