import createStore from 'react-waterfall'
import { Value } from 'slate'
import Plain from 'slate-plain-serializer'

const config = {
  initialState: {
    notes: [],
    notebooks: [],
    trash: [],
    syncItems: [],
    workingNote: null,
    workingNotebook: null,
    editorTitle: Plain.deserialize(''),
    editorContent: Plain.deserialize(''),
    user: null,
    isShowDrawer: true,
  },
  actionsCreators: {
    addNote: ({ notebooks, notes, syncItems }, _, note) => ({
      notebooks: notebooks.map(nb => {
        if (nb.id !== note.nbId) return nb
        return Object.assign(nb, {
          noteIds: [note.id, ...nb.noteIds],
          modifiedAt: new Date().toISOString(),
        })
      }),
      notes: [note, ...notes],
      workingNote: note,
      editorTitle: Plain.deserialize(''),
      editorContent: Plain.deserialize(''),
      syncItems: [...syncItems, note],
    }),
    editNote: ({ notes }, _, note) => ({
      notes: notes.map(n => (n.id === note.id ? note : n)),
    }),
    removeNote: ({ notebooks, notes, trash, syncItems }, _, note) => ({
      notebooks: notebooks.map(nb => {
        if (nb.id !== note.nbId) return nb
        return Object.assign(nb, {
          noteIds: nb.noteIds.filter(noteId => noteId !== note.id),
          modifiedAt: new Date().toISOString(),
        })
      }),
      notes: notes.filter(n => n.id !== note.id),
      trash: [note, ...trash],
      syncItems: [...syncItems, note],
    }),
    recoverNote: ({ notebooks, trash, syncItems }, _, note) => ({
      notebooks: notebooks.map(nb => {
        if (nb.id !== note.nbId) return nb
        return Object.assign(nb, { noteIds: [note.id, ...nb.noteIds] })
      }),
      trash: trash.filter(obj => obj.id !== note.id),
      workingNote: note,
      syncItems: [...syncItems, note],
    }),
    moveNote: ({ notebooks, trash }, _, note, nbId) => {
      if (nbId) {
        return {
          notebooks: notebooks.map(nb => {
            if (nb.id === nbId) {
              return Object.assign(nb, { noteIds: [note.id, ...nb.noteIds] })
            } else if (nb.id === note.nbId) {
              return Object.assign(nb, { noteIds: nb.noteIds.filter(id => id !== note.id) })
            }
            return nb
          }),
        }
      }
      return { trash: [note, ...trash] }
    },

    addNotebook: ({ notebooks, syncItems }, _, notebook) => ({
      notebooks: [notebook, ...notebooks],
      workingNotebook: notebook,
      syncItems: [...syncItems, notebook],
    }),
    editNotebook: ({ notebooks, syncItems }, _, notebook) => ({
      notebooks: notebooks.map(nb => (nb.id === notebook.id ? notebook : nb)),
      syncItems: [...syncItems, notebook],
    }),
    removeNotebook: ({ notebooks, trash, syncItems }, _, notebook) => ({
      notebooks: notebooks.filter(nb => nb.id !== notebook.id),
      trash: [notebook, ...trash],
      syncItems: [...syncItems, notebook],
    }),
    recoverNotebook: ({ notebooks, trash, syncItems }, _, notebook) => ({
      notebooks: [notebook, ...notebooks],
      trash: trash.filter(obj => obj.id !== notebook.id),
      workingNotebook: notebook,
      syncItems: [...syncItems, notebook],
    }),

    setNotes: (state, actions, notes) => ({ notes }),
    setNotebooks: (state, acitons, notebooks) => ({ notebooks }),
    setTrash: (state, actions, trash) => ({ trash }),
    setSyncItems: (state, actions, syncItems) => ({ syncItems }),
    setWorkingNote: ({ syncItems }, actions, note, options) => {
      if (options && options.editorOnChange) {
        return {
          workingNote: note,
          syncItems: [...syncItems, note],
        }
      }
      if (note) {
        const editorTitle = Plain.deserialize(note.title)
        const editorContent = Value.fromJSON(note.content)
        return {
          workingNote: note,
          editorTitle,
          editorContent,
        }
      }
      return {
        workingNote: null,
        editorTitle: Plain.deserialize(''),
        editorContent: Plain.deserialize(''),
      }
    },
    setWorkingNotebook: (state, actions, notebook) => ({ workingNotebook: notebook }),
    setNoteTitle: (state, actions, v) => ({ editorTitle: Value.fromJSON(v) }),
    setNoteContent: (state, actions, v) => ({ editorContent: Value.fromJSON(v) }),
    setUser: (state, actions, user) => ({ user }),
    toggleDrawer: (state, actions, isShowDrawer) => ({ isShowDrawer }),
  },
}

export const { actions, connect, Provider } = createStore(config)
