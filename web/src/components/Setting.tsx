import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import firebase from '../services/firebase/auth'
import router from '../services/router'
import storage from '../services/storage'

import Profile from './Profile'
import '../styles/Setting.scss'

const Setting = () => {
  const [isOpenDialog, setOpenDialog] = useState(false)

  const handleCloseDialog = () => setOpenDialog(false)

  const handleLogout = async () => {
    await storage.clear()
    await firebase.signOut()
    router.goto('/login')
  }

  return (
    <div className="setting">
      <Profile />
      <ul>
        <li onClick={() => setOpenDialog(true)}>Logout</li>
      </ul>
      <Dialog
        aria-labelledby="dialog-confirm-logout"
        onClose={handleCloseDialog}
        open={isOpenDialog}
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
