import firestore from './firebase/firestore'
import storage from './storage'

export async function syncFolders() {
  // TODO:
}

export async function syncNotes(noteIds: string[]) {
  let asyncTasks: Promise<void>[]

  const remoteNotes = await firestore.findNotesByIds(noteIds)
  const localNotes = await storage.findNotesByIds(noteIds)

  // TODO: diff two sources of notes
  const remoteOnlyNoteIds: string[] = []
  const localOnlyNoteIds: string[] = []
  const duplicatedNoteIds: string[] = []

  asyncTasks = []
  remoteOnlyNoteIds.map(id => {
    const rNote = remoteNotes.find(n => n.id === id)
    if (rNote) asyncTasks.push(storage.setNote(rNote))
  })
  await Promise.all(asyncTasks)

  asyncTasks = []
  localOnlyNoteIds.map(id => {
    const lNote = localNotes.find(n => n.id === id)
    if (lNote) asyncTasks.push(firestore.setNote(lNote))
  })
  await Promise.all(asyncTasks)

  asyncTasks = []
  duplicatedNoteIds.map(id => {
    const rNote = remoteNotes.find(n => n.id === id)
    const lNote = localNotes.find(n => n.id === id)
    if (rNote && lNote) {
      if (new Date(rNote.updatedAt) > new Date(lNote.updatedAt)) {
        asyncTasks.push(storage.setNote(rNote))
      } else {
        asyncTasks.push(firestore.setNote(lNote))
      }
    }
  })
  await Promise.all(asyncTasks)
}

export default {
  syncFolders,
  syncNotes,
}
