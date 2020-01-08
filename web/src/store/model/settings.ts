import { Action, action } from 'easy-peasy'

import Settings from '../../typings/settings'

const defaultSettings: Settings = {
  fontFamily: 'Sarabun',
  fontWeight: 300,
  fontSize: '1.3em',
  fontColor: '#444',
  letterSpacing: '0em',
  lineHeight: '1.65em',
}

export interface SettingsStateModel {
  settings: Settings
  set: Action<SettingsStateModel, Settings>
}

const settingsState: SettingsStateModel = {
  settings: defaultSettings,
  set: action((state, settings) => {
    state.settings = settings
  }),
}

export default settingsState
