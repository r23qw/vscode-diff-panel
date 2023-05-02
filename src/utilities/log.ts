import * as vscode from 'vscode'

const _logger = vscode.window.createOutputChannel('Diff Panel', { log: true })

export const logger = {
  info(...args: unknown[]) {
    args = args.map(arg => JSON.stringify(arg))
    _logger.info(args.join('\n'))
  },
  error(...args: unknown[]) {
    args = args.map(arg => JSON.stringify(arg))
    _logger.error(args.join('\n'))
  },
}
