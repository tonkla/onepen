import { Action, action } from 'easy-peasy'

export interface UserModel {
  name: string
  set: Action<UserModel, string>
}

const user: UserModel = {
  name: '',
  set: action((state, payload) => {
    state.name = payload
  }),
}

export default user
