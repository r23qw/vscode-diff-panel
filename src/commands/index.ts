import { Uri, commands } from 'vscode'
import { EXTENSION_ID, EXTENSTION_SCHEME } from '../../shared/constants'
import { getNonce } from '../utilities/getNonce'

export function registerCommands() {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: async () => {
        const text1 = Uri.parse(`${EXTENSTION_SCHEME}:A?_ts=${getNonce()}`)
        const text2 = Uri.parse(`${EXTENSTION_SCHEME}:B?_ts=${getNonce()}`)
        await commands.executeCommand('vscode.diff', text1, text2, 'Diff Panel', { preview: false })
      },
    },
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
