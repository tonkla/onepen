import React from 'react'

import { Firebase, Router } from '../services'
import { StyledLogin, StyledGoogleButton } from '../styles/login'

class Login extends React.Component {
  async componentDidMount() {
    if (await Firebase.isSignedIn()) Router.goto('/')
  }

  signInWithGoogle = async () => {
    try {
      if (await Firebase.signInWithGoogle()) Router.goto('/')
    } catch (err) {
      //
    }
  }

  render() {
    return (
      <StyledLogin>
        <StyledGoogleButton onClick={this.signInWithGoogle}>
          <img src="g-logo.png" alt="Google Logo" />
          <div>
            <span>Sign in with Google</span>
          </div>
        </StyledGoogleButton>
      </StyledLogin>
    )
  }
}

export { Login }
