import type { ExtensionContext } from 'vscode'
import { commands } from 'vscode'
import { EXTENSION_ID } from '../../shared/constants'
import { DiffPanelWebview } from '../panels/diff-panel'

export function registerCommands(context: ExtensionContext) {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: () => {
        // eslint-disable-next-line no-new
        new DiffPanelWebview(context)
      },
    },
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
