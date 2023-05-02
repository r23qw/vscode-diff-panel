import * as vscode from 'vscode'

export function showErrorMessage(message: string) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  vscode.window.showErrorMessage(`[Diff Panel] : ${message}`)
}
