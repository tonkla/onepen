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
  set: Thunk<SettingsStateModel, Settings>
  _set: Action<SettingsStateModel, Settings>
}

const settingsState: SettingsStateModel = {
  settings: defaultSettings,
  set: thunk(async (actions, settings) => {
    const _s = { ...settings, updatedAt: new Date().toISOString() }
    actions._set(_s)
    if (_s.owner) await firestore.setSettings(_s.owner, _s)
  }),
  _set: action((state, settings) => {
    state.settings = settings
  }),
}

export default settingsState
