import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

function renderApp(path: string) {
  ReactDOM.render(<App path={path} />, document.getElementById('root'))
}

window.addEventListener('popstate', () => {
  renderApp(window.location.pathname)
})
renderApp(window.location.pathname)
