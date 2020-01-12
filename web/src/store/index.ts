import { createStore, createTypedHooks } from 'easy-peasy'

import model, { StoreModel } from './model'
import { APP_NAME } from '../constants'

const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>()
export { useStoreActions, useStoreDispatch, useStoreState }

export default createStore(model, { name: APP_NAME })
