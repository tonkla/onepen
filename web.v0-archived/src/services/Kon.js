import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import { get } from 'lodash'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
})

const Kon = {
  ping: async () => {
    const query = gql`
      {
        ping
      }
    `
    const result = await client.query({ query })
    return result.data.ping
  },

  syncNote: async note => {
    note.content = ''
    const variables = { note }
    const mutation = gql`
      mutation SyncNote($note: NoteInput!) {
        setNote(note: $note) {
          id
          title
          modifiedAt
        }
      }
    `
    const result = await client.mutate({ mutation, variables })
    return get(result.data, 'setNote', null)
  },

  syncNotebook: async notebook => {
    const variables = { notebook }
    const mutation = gql`
      mutation SyncNotebook($notebook: NotebookInput!) {
        setNotebook(notebook: $notebook) {
          id
          name
          modifiedAt
        }
      }
    `
    const result = await client.mutate({ mutation, variables })
    return get(result.data, 'setNotebook', null)
  },
}
export { Kon }
