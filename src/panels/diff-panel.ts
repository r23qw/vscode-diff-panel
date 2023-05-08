import type { Disposable, ExtensionContext, WebviewPanel } from 'vscode'
import * as vscode from 'vscode'
import { getUri } from '../utilities/getUri'
import type { Message } from '../../shared/message'
import { EXTENSION_ID, WEBVIEW_PANEL_VIEW_TYPE } from '../../shared/constants'
import { getExtensionContext } from '../extension'
import type { FileTreeItem } from '../activity-bar/explorer'
import { fileStorage } from '../utilities/storage'

export class DiffPanel {
  disposables: Disposable[] = []
  panel: WebviewPanel | null = null
  context: ExtensionContext

  constructor() {
    this.context = getExtensionContext()
  }

  getWebviewContent(state = {}) {
    if (!this.panel)
      return ''

    const extensionUri = this.context.extensionUri
    const webview = this.panel.webview
    const baseUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets'])
    const cssLinks = ['index.panel.css', '_plugin-vue_export-helper.css']
      .map(filename => `<link rel="stylesheet" type="text/css" href="${baseUri.toString()}/${filename}"/>`)
      .join('')
    const scriptLinks = ['panel.js', '_plugin-vue_export-helper.js']
      .map(filename => `<script type="module" src="${baseUri.toString()}/${filename}"></script>`)
      .join('')

    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${cssLinks}
          <title>diff panel</title>
        </head>
        <body>
          <div id="app"></div>
          <script>
            window.__STATE__ = ${JSON.stringify(state)}
          </script>
          ${scriptLinks}
        </body>
      </html>
    `
  }

  registerPanelEvents() {
    if (!this.panel)
      return

    this.panel.onDidDispose(() => {
      this.disposables.forEach((fn) => {
        fn.dispose()
      })
      this.panel?.dispose()
    }, this, this.disposables)

    this.panel.webview.onDidReceiveMessage(async (message: Message) => {
      if (message.type === 'command')

        await vscode.commands.executeCommand<any>(`${EXTENSION_ID}.${message.command}`, ...message.payload)
    })
  }
}

export class DiffPanelWebview extends DiffPanel {
  static _panel: WebviewPanel | null
  disposables: Disposable[] = []
  viewColumn: vscode.ViewColumn
  constructor(viewColumn: vscode.ViewColumn = vscode.ViewColumn.One) {
    super()
    this.viewColumn = viewColumn

    if (DiffPanelWebview._panel)
      DiffPanelWebview._panel.reveal(viewColumn)
    else
      this.initlize()
  }

  initlize() {
    this.panel = vscode.window.createWebviewPanel(WEBVIEW_PANEL_VIEW_TYPE, 'Diff Panel', this.viewColumn, {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'out'),
        vscode.Uri.joinPath(this.context.extensionUri, 'webview-ui/build'),
      ],
      retainContextWhenHidden: true,
    })
    this.panel.webview.html = this.getWebviewContent()
    this.disposables.push({
      dispose() {
        DiffPanelWebview._panel = null
      },
    })
    this.registerPanelEvents()
    DiffPanelWebview._panel = this.panel
  }
}

export async function revealDiffPanel() {
  let tab: vscode.Tab | null = null
  let tabIndex = -1
  vscode.window.tabGroups.activeTabGroup.tabs.some((t, index) => {
    const input = t.input as { viewType: string }
    if (
      input?.viewType?.endsWith(WEBVIEW_PANEL_VIEW_TYPE)
    ) {
      tab = t
      tabIndex = index
      return true
    }
    return false
  })
  if (tab) {
    await vscode.commands.executeCommand('workbench.action.openEditorAtIndex', [tabIndex])
  }
  else {
    // eslint-disable-next-line no-new
    new DiffPanelWebview(vscode.window.tabGroups.activeTabGroup.viewColumn)
  }
  await vscode.commands.executeCommand('diff-panel-folder.focus')
}

export async function sendTextToDiffPanel(node: FileTreeItem, leftOrRight: 'left' | 'right') {
  const panel = DiffPanelWebview._panel
  if (!panel)
    return

  let text = ''

  const [_error, result] = await fileStorage.readText(node)
  if (typeof result === 'string')
    text = result
  else
    return

  await panel.webview.postMessage({
    type: 'diff-content',
    leftOrRight,
    payload: text,
  })
}
