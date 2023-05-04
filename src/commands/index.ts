import { commands } from 'vscode'
import { EXTENSION_ID } from '../../shared/constants'
import { revealDiffPanel } from '../panels/diff-panel'
import { fileStorage } from '../utilities/storage'
import { treeDataProvider } from '../activity-bar/explorer'
import type { FileTreeItem, FolderTreeItem } from '../activity-bar/explorer'

export function registerCommands() {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: () => {
        revealDiffPanel()
      },
    },
    {
      command: 'newFile',
      handler: async (node?: FolderTreeItem) => {
        await fileStorage.createFile(node)
        setTimeout(() => {
          treeDataProvider.refresh()
        })
      },
    },
    {
      command: 'newFolder',
      handler: async (node: FolderTreeItem) => {
        await fileStorage.createFolder(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'rename',
      handler: async (node: FileTreeItem | FolderTreeItem) => {
        await fileStorage.rename(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'delete',
      handler: async (node: FileTreeItem | FolderTreeItem) => {
        await fileStorage.remove(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'refreshExplorer',
      handler: () => {
        treeDataProvider.refresh()
      },
    },
    {
      command: 'asLeftDiff',
      handler: () => {
        revealDiffPanel()
      },
    },
    {
      command: 'asRightDiff',
      handler: () => {
        revealDiffPanel()
      },
    },
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
