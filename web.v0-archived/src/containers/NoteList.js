import React from 'react'
import PropTypes from 'prop-types'
import uuidv1 from 'uuid/v1'
import Plain from 'slate-plain-serializer'
import { NoteAdd, MoreHoriz, InsertDriveFile, InsertDriveFileOutlined } from '@material-ui/icons'

import { actions, connect } from '../store'
import { LocalStorage } from '../services'
import { ConfirmDialog } from '../presentations/dialogs'
import { OutsideClickHandler } from '../presentations/OutsideClickHandler'
import {
  StyledNoteList,
  StyledNoteItem,
  StyledNoteMenu,
  StyledAddNoteButton,
} from '../styles/drawer'

class NoteListComponent extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notes: PropTypes.array,
    trash: PropTypes.array,
    workingNotebook: PropTypes.object,
    workingNote: PropTypes.object,
  }

  state = {
    hoveringNoteId: null,
    editingNote: false,
    isShowConfirmDialog: false,
    dialogCallback: null,
  }

  async componentDidMount() {
    await this.setWorkingNote()
  }

  setWorkingNote = async () => {
    if (this.props.workingNote || !this.props.notes) return
    let note
    const id = await LocalStorage.getWorkingNoteId()
    if (id) note = this.props.notes.find(n => n.id === id)
    else if (this.props.notes.length > 0) note = this.props.notes[0]

    if (note) {
      await actions.setWorkingNote(note)
      await this.storeWorkingNoteId()
    }
  }

  storeNote = async () => {
    if (!this.props.workingNote || !this.props.notes) return
    const note = this.props.notes.find(n => n.id === this.props.workingNote.id)
    if (note) await LocalStorage.setNote(note)
  }

  storeNotebooks = async () => {
    if (!this.props.notebooks) return
    await LocalStorage.setNotebooks(this.props.notebooks)
  }

  storeWorkingNoteId = async () => {
    if (!this.props.workingNote) return
    await LocalStorage.setWorkingNoteId(this.props.workingNote.id)
  }

  addNote = async () => {
    const notebook = this.props.workingNotebook
    if (notebook) {
      const note = {
        nbId: notebook.id,
        id: uuidv1(),
        title: '',
        content: Plain.deserialize('', { toJSON: true }),
        modifiedAt: new Date().toISOString(),
      }
      await actions.addNote(note)
      await this.storeNotebooks()
      await this.storeNote()
      await this.storeWorkingNoteId()
    }
  }

  removeNote = async note => {
    note.removedAt = new Date().toISOString()
    await actions.removeNote(note)
    await LocalStorage.removeNote(note.id)
    // Update noteIds of the working notebook inside notebooks
    await LocalStorage.setNotebooks(this.props.notebooks)
    // Update trash with the new removed note
    await LocalStorage.setTrash(this.props.trash)

    // Set a new working note
    if (this.props.notes && this.props.notes.length > 0) {
      const note = this.props.notes[0]
      await actions.setWorkingNote(note)
      await LocalStorage.setWorkingNoteId(note.id)
    } else {
      await actions.setWorkingNote(null)
      await LocalStorage.removeWorkingNoteId()
    }
  }

  handleClickNoteItem = async note => {
    if (!this.props.workingNote || this.props.workingNote.id !== note.id) {
      await actions.setWorkingNote(note)
      await this.storeWorkingNoteId()
    }
  }

  handleClickRemoveNote = () => {
    this.setState({ isShowConfirmDialog: true, dialogCallback: this.removeNote })
  }

  handleCloseDialog = () => {
    this.setState({ isShowConfirmDialog: false })
  }

  renderAddNote = () => {
    return (
      <StyledAddNoteButton onClick={this.addNote}>
        <NoteAdd />
        <label>Add Note</label>
      </StyledAddNoteButton>
    )
  }

  renderNoteItem = (note, index) => {
    if (!note) return <div />

    const classNames = []
    if (index === 0) classNames.push('first')
    if (this.props.workingNote && this.props.workingNote.id === note.id) classNames.push('active')
    return (
      <StyledNoteItem
        key={note.id}
        className={classNames.join(' ')}
        onClick={() => this.handleClickNoteItem(note)}
        onMouseEnter={() => {
          this.setState({ hoveringNoteId: note.id })
        }}
        onMouseLeave={() => {
          this.setState({ hoveringNoteId: null })
        }}
      >
        {this.props.workingNote && this.props.workingNote.id === note.id ? (
          <InsertDriveFileOutlined />
        ) : (
          <InsertDriveFile />
        )}
        <label>{note.title || 'Untitled'}</label>
        {((this.state.hoveringNoteId && this.state.hoveringNoteId === note.id) ||
          (this.state.editingNote && this.state.editingNote.id === note.id)) && (
          <div className="menuWrapper">
            <div className="menuButton">
              <OutsideClickHandler
                display="flex"
                onOutsideClick={() => {
                  this.setState({ editingNote: null })
                }}
              >
                <MoreHoriz
                  style={{ width: 20, height: 20 }}
                  onClick={e => {
                    e.stopPropagation()
                    if (this.state.editingNote) {
                      this.setState({ editingNote: null })
                    } else {
                      this.setState({ editingNote: note })
                    }
                  }}
                />
                {this.state.editingNote && this.state.editingNote.id === note.id && (
                  <StyledNoteMenu>
                    <li onClick={this.handleClickRemoveNote}>Remove</li>
                  </StyledNoteMenu>
                )}
              </OutsideClickHandler>
            </div>
          </div>
        )}
      </StyledNoteItem>
    )
  }

  render() {
    return (
      <StyledNoteList>
        <h2>{this.props.workingNotebook.name}</h2>
        {this.renderAddNote()}
        <ul>{this.props.notes.map((note, index) => this.renderNoteItem(note, index))}</ul>
        {this.state.isShowConfirmDialog && (
          <ConfirmDialog
            open={this.state.isShowConfirmDialog}
            close={this.handleCloseDialog}
            dialogCallback={this.state.dialogCallback}
            note={this.state.editingNote}
            title="Remove the note"
            content="This action will move the note to a trash. Are you sure?"
          />
        )}
      </StyledNoteList>
    )
  }
}

const NoteList = connect(state => state)(NoteListComponent)
export { NoteList }
