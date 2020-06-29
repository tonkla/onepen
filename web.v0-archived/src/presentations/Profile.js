import React from 'react'
import PropTypes from 'prop-types'

import { Firebase, Router, LocalStorage } from '../services'
import { OutsideClickHandler } from './OutsideClickHandler'
import { StyledProfile, StyledAvatar, StyledProfileMenu } from '../styles/drawer'

class Profile extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  state = {
    isShowMenu: false,
  }

  settings = () => {}

  signOut = async () => {
    await LocalStorage.clear()
    await Firebase.signOut()
    Router.goto('/login')
  }

  render() {
    return (
      <StyledProfile>
        <OutsideClickHandler
          display="flex"
          style={{ justifyContent: 'center' }}
          onOutsideClick={() => {
            this.setState({ isShowMenu: false })
          }}
        >
          <StyledAvatar
            src={this.props.user.photoURL}
            alt={this.props.user.email}
            title={this.props.user.email}
            onClick={() => this.setState({ isShowMenu: !this.state.isShowMenu })}
          />
          {this.state.isShowMenu && (
            <StyledProfileMenu>
              <li onClick={this.settings}>Settings</li>
              <li onClick={this.signOut}>Sign out</li>
            </StyledProfileMenu>
          )}
        </OutsideClickHandler>
      </StyledProfile>
    )
  }
}
export { Profile }
