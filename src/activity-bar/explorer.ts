import * as vscode from 'vscode'
import type { TreeItemCollapsibleState } from 'vscode'
import { storage } from '../utilities/storage'
import type { Floder, FloderChildren, TextItem } from '../../shared/state'
import { EXTENSTION_SCHEME } from '../../shared/constants'

class FloderTreeItem extends vscode.TreeItem {
  context: Floder
  resourceUri: vscode.Uri
  constructor(label: string, collapsibleState: TreeItemCollapsibleState, payload: Floder) {
    super(label, collapsibleState)
    this.context = payload
    this.iconPath = ''
    this.resourceUri = vscode.Uri.from({ scheme: EXTENSTION_SCHEME, path: payload.id + payload.name })
  }
}
class TextTreeItem extends vscode.TreeItem {
  context: TextItem
  resourceUri: vscode.Uri
  constructor(label: string, collapsibleState: TreeItemCollapsibleState, payload: TextItem) {
    super(label, collapsibleState)
    this.context = payload
    this.iconPath = ''
    this.resourceUri = vscode.Uri.from({ scheme: 'diff', path: payload.id + payload.name })
  }
}

type DiffTreeItem = FloderTreeItem | TextTreeItem

class DiffFolderProvider implements vscode.TreeDataProvider<DiffTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<DiffTreeItem | undefined | null | void> = new vscode.EventEmitter<DiffTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<DiffTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  get rootData() {
    return storage.data.floder
  }

  getTreeItem(element: DiffTreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: FloderTreeItem): DiffTreeItem[] {
    if (!element)
      return this.generateChildren(this.rootData)

    else
      return this.generateChildren(element.context.children)
  }

  generateChildren(data: FloderChildren) {
    return data.map((item) => {
      if (item.type === 'floder')
        return new FloderTreeItem(item.name, vscode.TreeItemCollapsibleState.Collapsed, item)

      else
        return new TextTreeItem(item.name, vscode.TreeItemCollapsibleState.None, item)
    })
  }
}
export function registerFolderExplorer() {
  const treeDataProvider = new DiffFolderProvider()
  const treeView = vscode.window.createTreeView('diff-panel-folder', { treeDataProvider })
}
