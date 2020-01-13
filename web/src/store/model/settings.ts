import { Action, action } from 'easy-peasy'

import Settings from '../../typings/settings'

const defaultSettings: Settings = {
  fontFamily: 'Prompt',
  fontWeight: 300,
  fontSize: '1.3em',
  fontColor: '#444',
  letterSpacing: '0',
  lineHeight: '1.65em',
}

export interface SettingsStateModel {
  settings: Settings
  updatedAt: string
  set: Action<SettingsStateModel, Settings>
}

const settingsState: SettingsStateModel = {
  settings: defaultSettings,
  updatedAt: '',
  set: action((state, settings) => {
    state.settings = settings
    state.updatedAt = new Date().toISOString()
  }),
}

export default settingsState
