import type { ExtensionContext } from 'vscode'
import { registerWebviewViewProvider } from './activity-bar'
import { registerCommands } from './commands'
import { registerDiffPanelSerilizer } from './panels/diff-panel-serializer'
import { registerFolderExplorer } from './activity-bar/floder'
import { initializeStorageService } from './utilities/storage'

let extensionContext: ExtensionContext
export function getExtensionContext() {
  if (!extensionContext)
    throw new Error('Extension context is not initialized yet')
  return extensionContext
}
export function activate(context: ExtensionContext) {
  extensionContext = context

  initializeStorageService()

  registerCommands()
  registerWebviewViewProvider()
  registerDiffPanelSerilizer()
  registerFolderExplorer()
}
