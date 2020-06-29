import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

class AddNotebookDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    dialogCallback: PropTypes.func.isRequired,
    notebook: PropTypes.object,
  }

  state = {
    notebook: { name: '' }, // early called by render()
    title: '',
    buttonText: '',
  }

  componentDidMount() {
    if (this.props.notebook) {
      this.setState({
        notebook: Object.assign({}, this.props.notebook),
        title: 'Update the notebook',
        buttonText: 'Update',
      })
    } else {
      this.setState({
        title: 'Create a new notebook',
        buttonText: 'Create',
      })
    }
  }

  handleAddNotebook = async () => {
    if (this.state.notebook.name.trim() !== '') {
      const notebook = Object.assign(this.state.notebook, { name: this.state.notebook.name.trim() })
      await this.props.dialogCallback(notebook)
      this.props.close()
    } else {
      const notebook = Object.assign(this.state.notebook, { name: '' })
      this.setState({ notebook })
      this.textName.focus()
    }
  }

  handleChangeName = e => {
    const notebook = Object.assign(this.state.notebook, { name: e.target.value })
    this.setState({ notebook })
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open}>
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              inputRef={input => (this.textName = input)}
              label="Name"
              value={this.state.notebook.name}
              onChange={this.handleChangeName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.close}>Cancel</Button>
            <Button onClick={this.handleAddNotebook} color="primary">
              {this.state.buttonText}
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    )
  }
}

export { AddNotebookDialog }
