import type { ExtensionContext } from 'vscode'
import { registerWebviewViewProvider } from './activity-bar'
import { registerCommands } from './commands'
import { registerScheme } from './scheme'

export function activate(context: ExtensionContext) {
  registerCommands()
  registerScheme()
  registerWebviewViewProvider(context)
}
