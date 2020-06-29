import React from 'react'

import { Login } from './containers/Login'
import { Main } from './containers/Main'
import { Provider } from './store'

import './App.css'

class App extends React.Component {
  route = props => {
    switch (props.path) {
      case '/':
        return <Main />
      case '/login':
        return <Login />
      default:
        return <div />
    }
  }

  render() {
    return <Provider>{this.route(this.props)}</Provider>
  }
}

export default App
