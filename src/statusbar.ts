import * as vscode from 'vscode'
import { EXTENSION_ID } from '../shared/constants'

export function registerStatusBarItem() {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.command = `${EXTENSION_ID}.newDiffEditor`
  statusBarItem.tooltip = 'Open Diff Panel'
  statusBarItem.text = 'Diff Panel'
  statusBarItem.show()
}
