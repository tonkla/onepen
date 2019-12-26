import React from 'react'

import Profile from './Profile'

import '../styles/Setting.scss'

const Setting = () => {
  return (
    <div className="setting">
      <Profile />
      <ul>
        <li>Logout</li>
      </ul>
    </div>
  )
}

export default Setting
