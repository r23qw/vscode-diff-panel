export const enum DiffExplorerType {
  file = 'file',
  folder = 'folder',
}

export interface DiffFloder {
  type: DiffExplorerType.folder
  path: string
  name: string
}

export interface DiffFile {
  type: DiffExplorerType.file
  path: string
  name: string
}

export type DiffExplorerItem = DiffFloder | DiffFile
