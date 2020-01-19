export default interface Folder {
  id: string
  name: string
  parent: string
  owner: string
  noteIds: string[]
  createdAt: string
  updatedAt?: string
}
