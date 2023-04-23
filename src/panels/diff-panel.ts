import type { Disposable, ExtensionContext, WebviewPanel } from 'vscode'
import { Uri, ViewColumn, commands, window } from 'vscode'
import { getUri } from '../utilities/getUri'
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
          ${scriptLinks}
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
