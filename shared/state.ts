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
  tree: Floder[]
}

export const initGlobalState: GlobalState = {
  tree: [
    {
      name: 'test',
      type: 'floder',
      children: [
        { type: 'text', name: 'text', text: 'test' },
        { type: 'file', path: '~/.zshrc', name: 'zsh' },
      ],
    },
  ],
}
