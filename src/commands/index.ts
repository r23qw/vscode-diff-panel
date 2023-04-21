import type { ExtensionContext } from 'vscode'
import { commands } from 'vscode'
import { EXTENSION_ID } from '../../shared/constants'
import { DiffPanel } from '../panels/diff-panel'

export function registerCommands(context: ExtensionContext) {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: () => {
        // eslint-disable-next-line no-new
        new DiffPanel(context)
      },
    },
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
