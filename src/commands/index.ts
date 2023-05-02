import { commands } from 'vscode'
import { EXTENSION_ID } from '../../shared/constants'
import { DiffPanelWebview } from '../panels/diff-panel'
import { fileStorage } from '../utilities/storage'
import { logger } from '../utilities/log'
import { treeDataProvider } from '../activity-bar/explorer'

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
      handler: async () => {
        await fileStorage.createFile().catch((e: Error) => {
          logger.error(e)
        })
        treeDataProvider.refresh()
      },
    },
    {
      command: 'newFolder',
      handler: () => {},
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
