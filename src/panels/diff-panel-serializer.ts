import type { WebviewPanel, WebviewPanelSerializer } from 'vscode'
import * as vscode from 'vscode'
import { WEBVIEW_PANEL_VIEW_TYPE } from '../../shared/constants'
import { DiffPanel } from '../panels/diff-panel'

export class DiffPanelSerializer extends DiffPanel implements WebviewPanelSerializer {
  constructor() {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: Record<any, any>) {
    this.panel = webviewPanel
    this.panel.webview.html = this.getWebviewContent(state)
    this.registerPanelEvents()
  }
}

export function registerDiffPanelSerilizer() {
  vscode.window.registerWebviewPanelSerializer(WEBVIEW_PANEL_VIEW_TYPE, new DiffPanelSerializer())
}
