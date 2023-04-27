import * as vscode from 'vscode'

const _logger = vscode.window.createOutputChannel('Diff Panel', { log: true })

export const logger = {
  info(...args: any[]) {
    args = args.map(arg => JSON.stringify(arg))
    _logger.appendLine(args.join('\n'))
  },
}
