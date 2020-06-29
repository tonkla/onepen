import React from 'react'
import PropTypes from 'prop-types'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

import { actions, connect } from '../store'
// import { Profile } from '../presentations'
import { NotebookList } from './NotebookList'
import { NoteList } from './NoteList'

import { StyledDrawer, StyledPane1, StyledPane2 } from '../styles/layout'
import { StyledDrawerButton } from '../styles/drawer'

class DrawerComponent extends React.Component {
  static propTypes = {
    workingNotebook: PropTypes.object,
    user: PropTypes.object,
    isShowDrawer: PropTypes.bool,
  }

  toggleDrawer = () => {
    actions.toggleDrawer(!this.props.isShowDrawer)
  }

  render() {
    return (
      <StyledDrawer className={this.props.isShowDrawer ? '' : 'close'}>
        {this.props.isShowDrawer && (
          <div className="wrapper">
            <StyledPane1>
              {/* <Profile user={this.props.user} /> */}
              <NotebookList />
            </StyledPane1>
            {this.props.workingNotebook && (
              <StyledPane2>
                <NoteList />
              </StyledPane2>
            )}
          </div>
        )}
        <StyledDrawerButton
          onClick={this.toggleDrawer}
          className={this.props.isShowDrawer ? '' : 'close'}
        >
          {this.props.isShowDrawer ? (
            <KeyboardArrowLeft style={{ width: 30, height: 30 }} />
          ) : (
            <KeyboardArrowRight style={{ width: 30, height: 30 }} />
          )}
        </StyledDrawerButton>
      </StyledDrawer>
    )
  }
}

const Drawer = connect(({ workingNotebook, user, isShowDrawer }) => ({
  workingNotebook,
  user,
  isShowDrawer,
}))(DrawerComponent)
export { Drawer }
