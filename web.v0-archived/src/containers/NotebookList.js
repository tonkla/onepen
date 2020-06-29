import React from 'react'
import PropTypes from 'prop-types'
import uuidv1 from 'uuid/v1'
import {
  CreateNewFolderRounded,
  FolderRounded,
  FolderOpenRounded,
  MoreHoriz,
} from '@material-ui/icons'

import { actions, connect } from '../store'
import { LocalStorage } from '../services'
import { AddNotebookDialog, ConfirmDialog } from '../presentations/dialogs'
import { OutsideClickHandler } from '../presentations/OutsideClickHandler'
import {
  StyledNotebookList,
  StyledNotebookItem,
  StyledNotebookMenu,
  StyledAddNotebookButton,
} from '../styles/drawer'

class NotebookListComponent extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    trash: PropTypes.array,
    workingNotebook: PropTypes.object,
    workingNote: PropTypes.object,
  }

  state = {
    hoveringNotebook: null,
    editingNotebook: null,
    isShowFormDialog: false,
    isShowConfirmDialog: false,
    dialogCallback: null,
  }

  async componentDidMount() {
    await this.getNotebooks()
    await this.setWorkingNotebook()
    await this.getNotes()
  }

  getNotebooks = async () => {
    const notebooks = await LocalStorage.getNotebooks()
    if (Array.isArray(notebooks)) await actions.setNotebooks(notebooks)
  }

  setWorkingNotebook = async () => {
    if (this.props.workingNotebook || !this.props.notebooks) return
    const id = await LocalStorage.getWorkingNotebookId()
    const notebooks = this.props.notebooks
    const notebook = notebooks.find(n => n.id === id)
    if (notebook) {
      await actions.setWorkingNotebook(notebook)
    } else if (notebooks.length > 0) {
      const sortByModified = notebooks.sort((a, b) => {
        return new Date(a.modifiedAt) < new Date(b.modifiedAt) ? 1 : -1
      })
      await actions.setWorkingNotebook(sortByModified[0])
      await this.storeWorkingNotebookId()
    }
  }

  getNotes = async () => {
    if (!this.props.workingNotebook) return
    const notebook = this.props.notebooks.find(n => n.id === this.props.workingNotebook.id)
    if (notebook && Array.isArray(notebook.noteIds)) {
      const notes = await Promise.all(
        notebook.noteIds.map(async id => await LocalStorage.getNote(id)).filter(n => n)
      )
      await actions.setNotes(notes)
    }
  }

  storeNotebooks = async () => {
    if (!this.props.notebooks) return
    await LocalStorage.setNotebooks(this.props.notebooks)
  }

  storeWorkingNotebookId = async () => {
    if (!this.props.workingNotebook) return
    await LocalStorage.setWorkingNotebookId(this.props.workingNotebook.id)
  }

  storeTrash = async () => {
    if (!this.props.trash) return
    await LocalStorage.setTrash(this.props.trash)
  }

  removeWorkingNotebookId = async notebookId => {
    if (!this.props.workingNotebook) return
    if (notebookId === this.props.workingNotebook.id) {
      await actions.setWorkingNotebook(null)
      await LocalStorage.removeWorkingNotebookId()
    }
  }

  addNotebook = async nb => {
    const notebook = {
      id: uuidv1(),
      name: nb.name,
      modifiedAt: new Date().toISOString(),
      noteIds: [],
    }
    await actions.addNotebook(notebook)
    await this.getNotes()
    await this.storeNotebooks()
    await this.storeWorkingNotebookId()

    // Clear working note
    await actions.setWorkingNote(null)
    await LocalStorage.removeWorkingNoteId()
  }

  editNotebook = async notebook => {
    await actions.editNotebook(notebook)
    await actions.setWorkingNotebook(notebook)
    await this.storeNotebooks()
    await this.storeWorkingNotebookId()
  }

  removeNotebook = async notebook => {
    // Move notebook to trash
    notebook.removedAt = new Date().toISOString()
    await actions.removeNotebook(notebook)

    // Move all notes of the notebook to trash
    notebook.noteIds.forEach(async id => {
      const note = await LocalStorage.getNote(id)
      if (note) await actions.moveNote(note, null)
      await LocalStorage.removeNote(id)
    })

    await this.storeNotebooks()
    await this.storeTrash()

    // Clear working note if it is under the notebook
    if (this.props.workingNote && this.props.workingNote.nbId === notebook.id) {
      await LocalStorage.removeWorkingNoteId()
      await this.removeWorkingNotebookId(notebook.id)
      await this.setWorkingNotebook()
      await this.storeWorkingNotebookId()
      await this.getNotes()

      await actions.setWorkingNote(null)
    }
  }

  handleClickNotebookItem = async notebook => {
    if (!this.props.workingNotebook || this.props.workingNotebook.id !== notebook.id) {
      await actions.setWorkingNotebook(notebook)
      await this.storeWorkingNotebookId()
      await this.getNotes()
    }
  }

  handleClickAddNotebook = () => {
    this.setState({ isShowFormDialog: true, dialogCallback: this.addNotebook })
  }

  handleClickRename = () => {
    this.setState({ isShowFormDialog: true, dialogCallback: this.editNotebook })
  }

  handleClickRemove = () => {
    this.setState({ isShowConfirmDialog: true, dialogCallback: this.removeNotebook })
  }

  handleCloseDialog = () => {
    this.setState({
      isShowFormDialog: false,
      isShowConfirmDialog: false,
    })
  }

  renderNotebookItem = (notebook, index) => {
    const classNames = []
    if (index === 0) classNames.push('first')
    if (this.props.workingNotebook && this.props.workingNotebook.id === notebook.id)
      classNames.push('active')
    return (
      <StyledNotebookItem
        key={notebook.id}
        className={classNames.join(' ')}
        onClick={() => this.handleClickNotebookItem(notebook)}
        onMouseEnter={() => {
          this.setState({ hoveringNotebook: notebook })
        }}
        onMouseLeave={() => {
          this.setState({ hoveringNotebook: null })
        }}
      >
        {this.props.workingNotebook && this.props.workingNotebook.id === notebook.id ? (
          <FolderOpenRounded />
        ) : (
          <FolderRounded />
        )}
        <label>{notebook.name}</label>
        {((this.state.hoveringNotebook && this.state.hoveringNotebook.id === notebook.id) ||
          (this.state.editingNotebook && this.state.editingNotebook.id === notebook.id)) && (
          <div className="menuWrapper">
            <div className="menuButton">
              <OutsideClickHandler
                display="flex"
                onOutsideClick={() => {
                  this.setState({ editingNotebook: null })
                }}
              >
                <MoreHoriz
                  style={{ width: 20, height: 20 }}
                  onClick={e => {
                    e.stopPropagation()
                    if (this.state.editingNotebook) {
                      this.setState({ editingNotebook: null })
                    } else {
                      this.setState({ editingNotebook: notebook })
                    }
                  }}
                />
                {this.state.editingNotebook && this.state.editingNotebook.id === notebook.id && (
                  <StyledNotebookMenu>
                    <li onClick={this.handleClickRename}>Rename</li>
                    <li onClick={this.handleClickRemove}>Remove</li>
                  </StyledNotebookMenu>
                )}
              </OutsideClickHandler>
            </div>
          </div>
        )}
      </StyledNotebookItem>
    )
  }

  render() {
    return (
      <StyledNotebookList>
        <h2>NOTEBOOKS</h2>
        <StyledAddNotebookButton onClick={this.handleClickAddNotebook}>
          <CreateNewFolderRounded />
          <label>Add Notebook</label>
        </StyledAddNotebookButton>
        <ul>{this.props.notebooks.map((nb, index) => this.renderNotebookItem(nb, index))}</ul>
        {this.state.isShowFormDialog && (
          <AddNotebookDialog
            open={this.state.isShowFormDialog}
            close={this.handleCloseDialog}
            dialogCallback={this.state.dialogCallback}
            notebook={this.state.editingNotebook}
          />
        )}
        {this.state.isShowConfirmDialog && (
          <ConfirmDialog
            open={this.state.isShowConfirmDialog}
            close={this.handleCloseDialog}
            dialogCallback={this.state.dialogCallback}
            notebook={this.state.editingNotebook}
            title="Remove the notebook"
            content="This action will move the notebook to a trash. Are you sure?"
          />
        )}
      </StyledNotebookList>
    )
  }
}

const NotebookList = connect(state => state)(NotebookListComponent)
export { NotebookList }
