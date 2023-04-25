import { Uri } from 'vscode'
import type { ExtensionContext, Webview } from 'vscode'
import * as vscode from 'vscode'
import { getUri } from '../utilities/getUri'
import type { Message } from '../../shared/message'
import { EXTENSION_ID } from '../../shared/constants'

function getContent(webview: Webview, extensionUri: Uri) {
  const baseUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets'])
  const cssLinks = ['index.css', '_plugin-vue_export-helper.css']
    .map(filename => `<link rel="stylesheet" type="text/css" href="${baseUri.toString()}/${filename}"/>`)
    .join('')
  const scriptLinks = ['activity-bar.js', '_plugin-vue_export-helper.js']
    .map(filename => `<script type="module" src="${baseUri.toString()}/${filename}"></script>`)
    .join('')
  const iconCssUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'codicon.css'])
  return /* html */ `
       <!DOCTYPE html>
       <html lang="en">
         <head>
           <meta charset="UTF-8" />
           ${cssLinks}
           <link rel="stylesheet" type="text/css" href="${iconCssUri.toString()}">
           <title>activity bar</title>
         </head>
         <body>
           <div id="app"></div>
           ${scriptLinks}
         </body>
       </html>
     `
}

function registerOnDidReceiveMessage(webview: Webview) {
  webview.onDidReceiveMessage(async (message: Message) => {
    if (message.type === 'command')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await vscode.commands.executeCommand<any>(`${EXTENSION_ID}.${message.command}`, ...message.payload)
  })
}

export function registerWebviewViewProvider(context: ExtensionContext) {
  vscode.window.registerWebviewViewProvider('diff-panel-feedback', {
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
