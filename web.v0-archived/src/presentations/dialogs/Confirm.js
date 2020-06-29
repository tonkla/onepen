import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import lime from '@material-ui/core/colors/lime'

const theme = createMuiTheme({
  palette: {
    primary: { main: lime[700] },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Mali',
  },
})

class ConfirmDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    dialogCallback: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    notebook: PropTypes.object,
    note: PropTypes.object,
  }

  state = {
    object: null,
  }

  componentDidMount() {
    if (this.props.notebook) {
      this.setState({ object: Object.assign({}, this.props.notebook) })
    } else if (this.props.note) {
      this.setState({ object: Object.assign({}, this.props.note) })
    }
  }

  handleConfirm = () => {
    this.props.dialogCallback(this.state.object)
    this.props.close()
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open}>
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.props.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.close}>Cancel</Button>
            <Button onClick={this.handleConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    )
  }
}

export { ConfirmDialog }
