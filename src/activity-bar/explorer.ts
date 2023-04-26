import * as vscode from 'vscode'
import type { TreeItemCollapsibleState } from 'vscode'
import { storage } from '../utilities/storage'
import type { Floder, FloderChildren, TextItem } from '../../shared/state'
import { logger } from '../utilities/log'

class FloderTreeItem extends vscode.TreeItem {
  context: Floder
  constructor(label: string, collapsibleState: TreeItemCollapsibleState, payload: Floder) {
    super(label, collapsibleState)
    this.context = payload
    this.setIcon()
  }

  setIcon() {
    // this.iconPath = new vscode.ThemeIcon(this.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed ? 'folder' : 'folder-opened')
    this.iconPath = vscode.ThemeIcon.File
  }
}
class TextTreeItem extends vscode.TreeItem {
  context: TextItem
  constructor(label: string, collapsibleState: TreeItemCollapsibleState, payload: TextItem) {
    super(label, collapsibleState)
    this.context = payload
    this.iconPath = new vscode.ThemeIcon('text')
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

  getTreeItem(element: DiffTreeItem): DiffTreeItem {
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
        return new FloderTreeItem(item.name, vscode.TreeItemCollapsibleState.Expanded, item)

      else
        return new TextTreeItem(item.name, vscode.TreeItemCollapsibleState.None, item)
    })
  }
}
export function registerFolderExplorer() {
  const treeDataProvider = new DiffFolderProvider()
  const treeView = vscode.window.createTreeView('diff-panel-folder', { treeDataProvider })

  treeView.onDidExpandElement((event) => {
    if (event.element instanceof FloderTreeItem)
      event.element.setIcon()

    logger.info(event.element.iconPath)
  })
  treeView.onDidCollapseElement((event) => {
    logger.info('collapse')
    treeDataProvider.refresh()
  })
}
