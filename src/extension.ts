import type { ExtensionContext } from 'vscode'
import { registerWebviewViewProvider } from './activity-bar'
import { registerCommands } from './commands'

export function activate(context: ExtensionContext) {
  registerCommands(context)
  registerWebviewViewProvider(context)
}
