import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import SettingIcon from '@material-ui/icons/Settings'

import firebase from '../services/firebase/auth'
import router from '../services/router'
import storage from '../services/storage'
import { useStoreActions, useStoreState } from '../store'
import Settings from '../typings/settings'

import Profile from './Profile'
import '../styles/Setting.scss'

const Setting = () => {
  const [isOpenDialogSetting, setOpenDialogSetting] = useState(false)
  const [isOpenDialogLogout, setOpenDialogLogout] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [tmp, setTmp] = useState<Settings>()

  const s = useStoreState(s => s.settingsState.settings)
  const user = useStoreState(s => s.userState.user)

  const setSettings = useStoreActions(a => a.settingsState.set)

  const handleCloseDialog = () => {
    setOpenDialogSetting(false)
    setOpenDialogLogout(false)
    setAnchorEl(null)
  }

  const handleOpenDialogSetting = () => setOpenDialogSetting(true)

  const handleOpenDialogLogout = () => setOpenDialogLogout(true)

  const handleSaveSettings = () => {
    handleCloseDialog()
    if (user && tmp) setSettings({ ...s, ...tmp, owner: user.uid })
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
          <MenuItem onClick={handleOpenDialogSetting}>Settings</MenuItem>
          <MenuItem onClick={handleOpenDialogLogout}>Log out</MenuItem>
        </MenuList>
      </Popover>

      <Dialog
        aria-labelledby="dialog-setting"
        onClose={handleCloseDialog}
        open={isOpenDialogSetting}
      >
        <DialogTitle id="dialog-setting">Settings</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Typography gutterBottom style={{ fontSize: 18 }}>
                Editor Preferences
              </Typography>
              <Typography gutterBottom style={{ fontSize: 14 }}>
                See <a href="https://fonts.google.com">Google Fonts</a>
              </Typography>
              <TextField
                id="setting-font-family"
                label="Font Family"
                defaultValue={s.fontFamily}
                onBlur={e => setTmp({ ...tmp, fontFamily: e.target.value.trim() })}
                margin="dense"
                fullWidth
              />
              <TextField
                id="setting-font-weight"
                label="Font Weight"
                type="number"
                defaultValue={s.fontWeight}
                onBlur={e => setTmp({ ...tmp, fontWeight: parseInt(e.target.value.trim()) })}
                margin="dense"
                fullWidth
              />
              <TextField
                id="setting-font-size"
                label="Font Size"
                defaultValue={s.fontSize}
                onBlur={e => setTmp({ ...tmp, fontSize: e.target.value.trim() })}
                margin="dense"
                fullWidth
              />
              <TextField
                id="setting-font-color"
                label="Font Color"
                defaultValue={s.fontColor}
                onBlur={e => setTmp({ ...tmp, fontColor: e.target.value.trim() })}
                margin="dense"
                fullWidth
              />
              <TextField
                id="setting-letter-spacing"
                label="Letter Spacing"
                defaultValue={s.letterSpacing}
                onBlur={e => setTmp({ ...tmp, letterSpacing: e.target.value.trim() })}
                margin="dense"
                fullWidth
              />
              <TextField
                id="setting-line-height"
                label="Line Height"
                defaultValue={s.lineHeight}
                onBlur={e => setTmp({ ...tmp, lineHeight: e.target.value.trim() })}
                margin="dense"
                fullWidth
              />
            </CardContent>
            <CardActions>
              <Button size="small">Reset</Button>
            </CardActions>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="primary" onClick={handleSaveSettings}>
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
