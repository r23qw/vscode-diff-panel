import { Uri, commands } from 'vscode'
import { EXTENSION_ID, EXTENSTION_SCHEME } from '../../shared/constants'

export function registerCommands() {
  const commandList = [
    {
      command: 'newDiffEditor',
      handler: async () => {
        const text1 = Uri.parse(`${EXTENSTION_SCHEME}:A?_ts=${Date.now()}`)
        const text2 = Uri.parse(`${EXTENSTION_SCHEME}:B?_ts=${Date.now()}`)
        await commands.executeCommand('vscode.diff', text1, text2, 'Diff Panel', { preview: false })
      },
    },
  ]

  commandList.forEach(({ command, handler }) => {
    commands.registerCommand(`${EXTENSION_ID}.${command}`, handler)
  })
}
