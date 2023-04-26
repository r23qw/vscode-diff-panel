export interface TextItem {
  type: 'text'
  name: string
  text: string
}
export interface FileItem {
  type: 'file'
  name: string
  path: string
}

export type DiffItem = TextItem | FileItem

export interface Floder {
  type: 'floder'
  name: string
  children: (Floder | DiffItem)[]
}

export interface GlobalState {
  floder: Floder[]
}
