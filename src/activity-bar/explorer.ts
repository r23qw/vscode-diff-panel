import * as vscode from 'vscode'
import { TreeItemCollapsibleState } from 'vscode'
import { fileStorage } from '../utilities/storage'
import { EXTENSTION_SCHEME } from '../../shared/constants'
import type { DiffFile, DiffFloder } from '../../shared/state'
import { DiffExplorerType } from '../../shared/state'

export class FloderTreeItem extends vscode.TreeItem {
  contextValue = DiffExplorerType.folder
  context: DiffFloder
  resourceUri: vscode.Uri
  constructor(label: string, collapsibleState: TreeItemCollapsibleState, payload: DiffFloder) {
    super(label, collapsibleState)
    this.context = payload
    this.iconPath = ''
    this.resourceUri = vscode.Uri.from({ scheme: EXTENSTION_SCHEME, path: payload.path })
  }
}
export class FileTreeItem extends vscode.TreeItem {
  contextValue = DiffExplorerType.file
  context: DiffFile
  resourceUri: vscode.Uri
  constructor(label: string, collapsibleState: TreeItemCollapsibleState, payload: DiffFile) {
    super(label, collapsibleState)
    this.context = payload
    this.iconPath = ''
    this.resourceUri = vscode.Uri.from({ scheme: 'diff', path: payload.path })
  }

  async openTextDocument() {
    const filePath = vscode.Uri.file(this.context.path).with({ scheme: 'file' })
    try {
      await vscode.workspace.openTextDocument(filePath).then(async (document) => {
        await vscode.window.showTextDocument(document, { preview: true })
      })
    }
    catch {}
  }
}

type DiffTreeItem = FloderTreeItem | FileTreeItem

class DiffFolderProvider implements vscode.TreeDataProvider<DiffTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<DiffTreeItem | undefined | null | void> = new vscode.EventEmitter<DiffTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<DiffTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: DiffTreeItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: FloderTreeItem): Promise<DiffTreeItem[]> {
    const isRoot = !element
    const children: (DiffFile | DiffFloder)[] = await fileStorage.getChildren(isRoot ? undefined : element.context.path)

    children.sort((a, b) => {
      if (a.type === DiffExplorerType.folder && b.type === DiffExplorerType.file)
        return -1
      if (a.type === DiffExplorerType.file && b.type === DiffExplorerType.folder)
        return 1

      return a.name > b.name ? 1 : -1
    })

    return children.map((i) => {
      if (i.type === DiffExplorerType.folder)
        return new FloderTreeItem(i.name, TreeItemCollapsibleState.Collapsed, i)
      else
        return new FileTreeItem(i.name, TreeItemCollapsibleState.None, i)
    })
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let treeDataProvider: DiffFolderProvider
// eslint-disable-next-line import/no-mutable-exports
export let treeview: vscode.TreeView<DiffTreeItem>
export function registerFolderExplorer() {
  treeDataProvider = new DiffFolderProvider()
  treeview = vscode.window.createTreeView('diff-panel-folder', { treeDataProvider })
  treeview.onDidChangeSelection(async (event) => {
    const [item] = event.selection
    if (item instanceof FileTreeItem)
      await item.openTextDocument()
  })
}
