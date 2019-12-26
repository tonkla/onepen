import { Action, action } from 'easy-peasy'

export interface UserStateModel {
  name: string
  set: Action<UserStateModel, string>
}

const userState: UserStateModel = {
  name: '',
  set: action((state, name) => {
    state.name = name
  }),
}

export default userState
