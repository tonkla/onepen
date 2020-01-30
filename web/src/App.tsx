import React from 'react'
import { StoreProvider } from 'easy-peasy'

import Login from './components/Login'
import Main from './components/Main'
import store from './store'

import './styles/App.scss'

interface AppProps {
  path: string
}

const route = (path: string) => {
  switch (path) {
    case '/':
      return <Main />
    default:
      return <Login />
  }
}

const App = ({ path }: AppProps) => <StoreProvider store={store}>{route(path)}</StoreProvider>

export default App
