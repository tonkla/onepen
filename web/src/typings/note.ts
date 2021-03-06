export interface TinyNote {
  id: string
  parent: string
  owner: string
  title: string
  createdAt: string
  updatedAt?: string
}

export default interface Note {
  id: string
  parent: string
  owner: string
  title: string
  body: string
  createdAt: string
  updatedAt?: string
}
