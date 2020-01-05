export interface TinyNote {
  parent: string
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export default interface Note {
  parent: string
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}
