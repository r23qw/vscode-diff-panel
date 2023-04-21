import type { Disposable, ExtensionContext, WebviewPanel } from 'vscode'
import { Uri, ViewColumn, commands, window } from 'vscode'
import { getUri } from '../utilities/getUri'
import { getNonce } from '../utilities/getNonce'
import type { Message } from '../../shared/message'
import { EXTENSION_ID } from '../../shared/constants'

export class DiffPanel {
  disposables: Disposable[] = []
  panel: WebviewPanel
  context: ExtensionContext

  constructor(context: ExtensionContext) {
    this.context = context
    this.panel = window.createWebviewPanel('diff-panel', 'Diff Panel', ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [
        Uri.joinPath(context.extensionUri, 'out'),
        Uri.joinPath(context.extensionUri, 'webview-ui/build'),
      ],
    })
    this.panel.webview.html = this.getWebviewContent()
    this.registerPanelEvents()
  }

  getWebviewContent() {
    const extensionUri = this.context.extensionUri
    const webview = this.panel.webview

    const stylesUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets', 'index.css'])
    const scriptUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets', 'index.js'])

    const nonce = getNonce()

    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource.toString()}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri.toString()}">
          <title>Hello World</title>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri.toString()}"></script>
        </body>
      </html>
    `
  }

  registerPanelEvents() {
    this.panel.onDidDispose(() => {
      this.disposables.forEach((fn) => {
        fn.dispose()
      })
      this.panel.dispose()
    }, this, this.disposables)

    this.panel.webview.onDidReceiveMessage(async (message: Message) => {
      if (message.type === 'command')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await commands.executeCommand<any>(`${EXTENSION_ID}.${message.command}`, ...message.payload)
    })
  }
}
