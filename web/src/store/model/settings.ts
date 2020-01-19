import { Action, action, Thunk, thunk } from 'easy-peasy'

import firestore from '../../services/firebase/firestore'
import Settings from '../../typings/settings'

const defaultSettings: Settings = {
  fontFamily: 'Prompt',
  fontWeight: 300,
  fontSize: '1.3em',
  fontColor: '#333',
  letterSpacing: '0',
  lineHeight: '1.65em',
}

export interface SettingsStateModel {
  settings: Settings
  update: Thunk<SettingsStateModel, Settings>
  _update: Action<SettingsStateModel, Settings>
}

const settingsState: SettingsStateModel = {
  settings: defaultSettings,
  update: thunk(async (actions, settings) => {
    const _s = { ...settings, updatedAt: new Date().toISOString() }
    actions._update(_s)
    if (_s.owner) await firestore.setSettings(_s.owner, _s)
  }),
  _update: action((state, settings) => {
    state.settings = settings
  }),
}

export default settingsState
