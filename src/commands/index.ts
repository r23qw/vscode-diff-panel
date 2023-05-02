import { commands } from 'vscode'
import { EXTENSION_ID } from '../../shared/constants'
import { DiffPanelWebview } from '../panels/diff-panel'
import { fileStorage } from '../utilities/storage'
import { treeDataProvider } from '../activity-bar/explorer'
import type { FileTreeItem, FloderTreeItem } from '../activity-bar/explorer'

export function registerCommands() {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: () => {
        // eslint-disable-next-line no-new
        new DiffPanelWebview()
      },
    },
    {
      command: 'newFile',
      handler: async (node?: FloderTreeItem) => {
        await fileStorage.createFile(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'newFolder',
      handler: async (node: FloderTreeItem) => {
        await fileStorage.createFolder(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'rename',
      handler: async (node: FileTreeItem | FloderTreeItem) => {
        await fileStorage.rename(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'delete',
      handler: async (node: FileTreeItem | FloderTreeItem) => {
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
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
