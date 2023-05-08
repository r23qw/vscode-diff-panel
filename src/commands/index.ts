import { commands } from 'vscode'
import { EXTENSION_ID } from '../../shared/constants'
import { revealDiffPanel, sendTextToDiffPanel } from '../panels/diff-panel'
import { fileStorage } from '../utilities/storage'
import { treeDataProvider } from '../activity-bar/explorer'
import type { DiffTreeItem, FileTreeItem, FolderTreeItem } from '../activity-bar/explorer'

export function registerCommands() {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: async () => {
        await revealDiffPanel()
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
      handler: async (node: DiffTreeItem) => {
        await fileStorage.rename(node)
        treeDataProvider.refresh()
      },
    },
    {
      command: 'delete',
      handler: async (node: DiffTreeItem) => {
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
      handler: async (node: FileTreeItem) => {
        await revealDiffPanel()
        await sendTextToDiffPanel(node, 'left')
      },
    },
    {
      command: 'asRightDiff',
      handler: async (node: FileTreeItem) => {
        await revealDiffPanel()
        await sendTextToDiffPanel(node, 'right')
      },
    },
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
