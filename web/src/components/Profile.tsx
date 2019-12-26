import React from 'react'

import { useStoreState } from '../store'

const Profile = () => {
  const user = useStoreState(state => state.userState)
  return (
    <div className="profile">
      <div>
        <span>Hi, {user.name}</span>
      </div>
    </div>
  )
}

export default Profile
