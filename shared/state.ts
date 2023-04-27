const uuid = () => Math.random().toString(36).slice(2)

export interface TextItem {
  id: string
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
  id: string
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
      id: uuid(),
      name: 'test',
      type: 'floder',
      children: [
        { id: uuid(), type: 'text', name: 'text.js', text: 'test' },
        // { type: 'file', path: '~/.zshrc', name: 'zsh' },
      ],
    },
    {
      id: uuid(),
      name: 'test2.json',
      type: 'text',
      text: 'test2',
    },
  ],
}
