import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'
import { deepEqual } from 'fast-equals'

import { Drawer } from './Drawer'
import { actions, connect } from '../store'
import { LocalStorage, Kon } from '../services'
// import { Firebase, Router, LocalStorage, Kon } from '../services'
import { StyledContainer, StyledContent } from '../styles/layout'
import { StyledContentTitle, StyledContentBody } from '../styles/content'
import { KEY_WORKING_NOTE, KEY_WORKING_NOTEBOOK, KEY_TRASH } from '../constants'

class MainComponent extends React.Component {
  static propTypes = {
    notebooks: PropTypes.array,
    notes: PropTypes.array,
    trash: PropTypes.array,
    syncItems: PropTypes.array,
    workingNote: PropTypes.object,
    editorTitle: PropTypes.object,
    editorContent: PropTypes.object,
    user: PropTypes.object,
    isShowDrawer: PropTypes.bool,
  }

  // syncTimerId = null

  async componentDidMount() {
    // if (await Firebase.isSignedIn()) {
    //   const user = await Firebase.currentUser()
    //   if (user) await actions.setUser(user)
    // } else Router.goto('/login')

    const noteId = await LocalStorage.getWorkingNoteId()
    const note = await LocalStorage.getNote(noteId)
    if (note) await actions.setWorkingNote(note)

    const syncItems = await LocalStorage.getSyncItems()
    if (syncItems && Array.isArray(syncItems)) await actions.setSyncItems(syncItems)

    // this.syncTimerId = setInterval(this.syncUp, 1000 * 10)
  }

  componentWillUnmount() {
    if (this.syncTimerId) clearInterval(this.syncTimerId)
  }

  syncUp = async () => {
    if (!this.props.syncItems || this.props.syncItems.length === 0) return
    const syncItems = [...this.props.syncItems] // Clone the array
    const item = syncItems.pop()
    if (!item) return

    const _syncItems = syncItems.filter((_item) => {
      if (typeof _item === 'string') return _item !== item
      else if (_item.id !== item.id) return true
      return new Date(_item.modifiedAt) <= new Date(item.modifiedAt) ? false : true
    })
    await actions.setSyncItems(_syncItems)
    await LocalStorage.setSyncItems(_syncItems)

    if (item.id) {
      if (item.nbId) {
        await Kon.syncNote(item)
      } else {
        await Kon.syncNotebook(item)
      }
    } else {
      if (item === KEY_WORKING_NOTE) {
        // const id = await LocalStorage.getWorkingNoteId()
        // await Kon.syncWorkingNoteId(id)
      } else if (item === KEY_WORKING_NOTEBOOK) {
        // const id = await LocalStorage.getWorkingNotebookId()
        // await Kon.syncWorkingNotebookId(id)
      } else if (item === KEY_TRASH) {
        // const trash = await LocalStorage.getTrash()
        // await Kon.syncTrash(trash)
      }
    }
  }

  storeNote = async () => {
    if (!this.props.workingNote) return
    await LocalStorage.setNote(this.props.workingNote)
  }

  handleChangeTitle = async ({ value }) => {
    await actions.setNoteTitle(value)
    const title = Plain.serialize(value)
    const note = Object.assign({}, this.props.workingNote, { title })
    if (!deepEqual(note.title, this.props.workingNote.title)) {
      note.modifiedAt = new Date().toISOString()
      await actions.editNote(note) // Change the title on the note list pane
      await actions.setWorkingNote(note, { editorOnChange: true })
      await this.storeNote()
    }
  }

  handleChangeContent = async ({ value }) => {
    await actions.setNoteContent(value)
    const content = value.toJSON()
    const note = Object.assign({}, this.props.workingNote, { content })
    if (!deepEqual(note.content, this.props.workingNote.content)) {
      note.modifiedAt = new Date().toISOString()
      await actions.setWorkingNote(note, { editorOnChange: true })
      await this.storeNote()
    }
  }

  handleKeyDownTitle = (event, editor, next) => {
    return event.key === 'Enter' ? this.content.focus() : next()
  }

  render() {
    // if (!this.props.user) return <div />

    return (
      <StyledContainer>
        <Drawer />
        {this.props.workingNote && (
          <StyledContent className={this.props.isShowDrawer ? '' : 'fullscreen'}>
            <StyledContentTitle>
              <Editor
                className="title"
                placeholder="Title"
                value={this.props.editorTitle}
                onChange={this.handleChangeTitle}
                onKeyDown={this.handleKeyDownTitle}
              />
            </StyledContentTitle>
            <StyledContentBody>
              <Editor
                ref={(node) => (this.content = node)}
                className="content"
                placeholder="Tell your story..."
                value={this.props.editorContent}
                onChange={this.handleChangeContent}
              />
            </StyledContentBody>
          </StyledContent>
        )}
      </StyledContainer>
    )
  }
}

const Main = connect((state) => state)(MainComponent)
export { Main }
