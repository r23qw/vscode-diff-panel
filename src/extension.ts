import type { ExtensionContext } from 'vscode'
import { registerWebviewViewProvider } from './activity-bar'
import { registerCommands } from './commands'
import { registerDiffPanelSerilizer } from './panels/diff-panel-serializer'

export function activate(context: ExtensionContext) {
  registerCommands(context)
  registerWebviewViewProvider(context)
  registerDiffPanelSerilizer(context)
}
