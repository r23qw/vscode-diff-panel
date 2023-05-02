export const enum DiffExplorerType {
  file,
  floder,
}

export interface DiffFloder {
  type: DiffExplorerType.floder
  path: string
  name: string
}

export interface DiffFile {
  type: DiffExplorerType.file
  path: string
  name: string
}

export type DiffExplorerItem = DiffFloder | DiffFile
