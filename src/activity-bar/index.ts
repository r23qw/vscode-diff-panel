import { Uri } from 'vscode'
import type { ExtensionContext, Webview } from 'vscode'
import * as vscode from 'vscode'
import { getUri } from '../utilities/getUri'
import { getNonce } from '../utilities/getNonce'
import type { Message } from '../../shared/message'
import { EXTENSION_ID } from '../../shared/constants'

function getContent(webview: Webview, extensionUri: Uri) {
  const stylesUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets', 'index.css'])
  const scriptUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets', 'index.js'])
  const nonce = getNonce()

  return /* html */ `
       <!DOCTYPE html>
       <html lang="en">
         <head>
           <meta charset="UTF-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
           <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
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

function registerOnDidReceiveMessage(webview: Webview) {
  webview.onDidReceiveMessage(async (message: Message) => {
    if (message.type === 'command') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      vscode.window.showInformationMessage(`Command: ${message.command}`)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await vscode.commands.executeCommand(`${EXTENSION_ID}.${message.command}`, ...message.payload)
    }
  })
}

export function registerWebviewViewProvider(context: ExtensionContext) {
  vscode.window.registerWebviewViewProvider('diff-panel', {
    resolveWebviewView(webviewView) {
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          Uri.joinPath(context.extensionUri, 'out'),
          Uri.joinPath(context.extensionUri, 'webview-ui/build'),
        ],
      }
      const content = getContent(webviewView.webview, context.extensionUri)
      webviewView.webview.html = content
      registerOnDidReceiveMessage(webviewView.webview)
    },
  }, {
    webviewOptions: {
      retainContextWhenHidden: true,
    },
  })
}
