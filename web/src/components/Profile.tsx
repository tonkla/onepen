import React from 'react'

import { useStoreState } from '../store'

import '../styles/Profile.scss'

const Profile = () => {
  const user = useStoreState(state => state.userState.user)
  return user ? (
    <div className="profile">
      <img src={user.photoUrl} alt={user.name} title={user.name} className="avatar" />
    </div>
  ) : (
    <div />
  )
}

export default Profile
