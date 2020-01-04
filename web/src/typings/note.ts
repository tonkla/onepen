export interface TinyNote {
  id: string
  title: string
  updatedAt: string
}

export default interface Note {
  id: string
  title: string
  body: string
  parent: string
  createdAt: string
  updatedAt: string
}
