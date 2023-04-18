import type { TextDocumentContentProvider, Uri } from 'vscode'
import { workspace } from 'vscode'
import { EXTENSTION_SCHEME } from '../../shared/constants'

class DiffPanelSchemeProvider implements TextDocumentContentProvider {
  provideTextDocumentContent(uri: Uri) {
    console.log(uri)
    return uri.path
  }
}

export function registerScheme() {
  workspace.registerTextDocumentContentProvider(EXTENSTION_SCHEME, new DiffPanelSchemeProvider())
}
