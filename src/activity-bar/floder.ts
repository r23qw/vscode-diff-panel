import * as vscode from 'vscode'
import { storage } from '../utilities/storage'

class DiffTreeItem extends vscode.TreeItem {
  iconPath = vscode.ThemeIcon.Folder
}

class DiffFolderProvider implements vscode.TreeDataProvider<DiffTreeItem> {
  get data() {
    return storage.data.floder
  }

  getTreeItem(element: DiffTreeItem): DiffTreeItem {
    return element
  }

  getChildren(element?: DiffTreeItem): DiffTreeItem[] {
    return [new DiffTreeItem('test')]
  }
}
export function registerFolderExplorer() {
  vscode.window.registerTreeDataProvider('diff-panel-folder', new DiffFolderProvider())
}
