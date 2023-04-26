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

export type DiffItem = TextItem

export type FloderChildren = (Floder | DiffItem)[]

export interface Floder {
  type: 'floder'
  name: string
  children: FloderChildren
}

export interface GlobalState {
  floder: FloderChildren
}

export const initGlobalState: GlobalState = {
  floder: [
    {
      name: 'test',
      type: 'floder',
      children: [
        { type: 'text', name: 'text', text: 'test' },
        // { type: 'file', path: '~/.zshrc', name: 'zsh' },
      ],
    },
    {
      name: 'test2',
      type: 'text',
      text: 'test2',
    },
  ],
}
