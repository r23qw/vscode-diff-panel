import * as path from 'node:path'
import type { ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import { getExtensionContext } from '../extension'
import type { DiffExplorerItem } from '../../shared/state'
import { DiffExplorerType } from '../../shared/state'
import { treeview } from '../activity-bar/explorer'
import type { DiffTreeItem, FileTreeItem, FolderTreeItem } from '../activity-bar/explorer'
import { logger } from './log'
import { showErrorMessage } from './message'

class FileStorageService {
  context: ExtensionContext = getExtensionContext()
  storageUrl: string = this.context.globalStorageUri.path
  dataDir = path.join(this.storageUrl, 'data')

  constructor() {
    this.initilize().catch(error => logger.error(error))
  }

  get currentSelectedDir() {
    const [selected] = treeview.selection
    if (!selected)
      return this.dataDir
    const selectedPath = selected.context.path
    return selected.context.type === DiffExplorerType.file ? path.dirname(selectedPath) : selectedPath
  }

  async initilize() {
    const hasDataDir = await fs.pathExists(this.dataDir)
    if (!hasDataDir)
      await fs.ensureDir(this.dataDir)
  }

  async createFile(node?: DiffTreeItem) {
    const filename = await vscode.window.showInputBox({
      placeHolder: 'please input filename',
      title: 'filename',
      prompt: 'recommand with file extension name',
    })
    if (!filename)
      return

    const [selected] = treeview.selection
    const dirPath = (node && selected)
      ? node.context.type === DiffExplorerType.file
        ? path.dirname(node.context.path)
        : node.context.path
      : this.currentSelectedDir
    const filePath = path.join(dirPath, filename)
    const existPath = await fs.exists(filePath)

    if (existPath) {
      showErrorMessage('file or folder already exist, please choose different name.')
      return
    }

    await fs.createFile(filePath).catch((e: Error) => {
      logger.error(e)
      showErrorMessage(`create file failed: ${e.message}`)
    })

    if (node)
      node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
  }

  async createFolder(node?: DiffTreeItem) {
    const dirname = await vscode.window.showInputBox({
      placeHolder: 'please input folder name',
      title: 'folder name',
    })
    if (!dirname)
      return

    const [selected] = treeview.selection
    const dirBasePath = (node && selected)
      ? node.context.type === DiffExplorerType.file
        ? path.dirname(node.context.path)
        : node.context.path
      : this.currentSelectedDir

    const dirPath = path.join(dirBasePath, dirname)
    const isExisted = await fs.exists(dirPath)

    if (isExisted) {
      showErrorMessage('file or folder already exist, please choose different name.')
      return
    }

    await fs.mkdir(dirPath).catch((e: Error) => {
      logger.error(e)
      showErrorMessage(`create folder failed: ${e.message}`)
    })

    if (node)
      node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
  }

  async remove(node?: DiffTreeItem) {
    const target: readonly DiffTreeItem[] = node ? [node] : treeview.selection
    if (target.length <= 0) {
      showErrorMessage('please select a file or folder')
      return
    }

    await Promise.all(target.map(async (item) => {
      const itemPath = item.context.path
      await fs.remove(itemPath).catch((e: Error) => {
        logger.error(e)
        showErrorMessage(`delete failed: ${e.message}`)
      })
    }))
  }

  async rename(node?: DiffTreeItem) {
    const [selected] = treeview.selection
    if (!selected && !node) {
      showErrorMessage('please select a file or folder')
      return
    }
    const targetNode = node || selected
    const newName = await vscode.window.showInputBox({
      placeHolder: 'please input new name',
      title: 'rename',
      value: targetNode.context.name || '',
    })
    if (!newName)
      return

    const itemPath = targetNode.context.path
    const newPath = path.join(path.dirname(itemPath), newName)
    const isNewPathExisted = await fs.exists(newPath)

    if (isNewPathExisted) {
      showErrorMessage('file or folder already exist, please choose different name.')
      return
    }

    await fs.rename(itemPath, newPath).catch((e: Error) => {
      logger.error(e)
      showErrorMessage(`rename failed: ${e.message}`)
    })
  }

  async move(from: DiffTreeItem | DiffTreeItem[], to?: FolderTreeItem) {
    from = Array.isArray(from) ? from : [from]

    await Promise.all(from.map(async (item) => {
      const fromPath = item.context.path
      const toPath = path.join(to ? to.context.path : this.dataDir, item.context.name)
      await fs.move(fromPath, toPath).catch((e: Error) => {
        logger.error(e)
        showErrorMessage(`move failed: ${e.message}`)
      })
    }))
  }

  async readText(node: FileTreeItem) {
    const result = await fs.readFile(node.context.path, 'utf-8').catch((e: Error) => {
      logger.error(e)
      showErrorMessage(`read file failed: ${e.message}`)
      return e
    })
    return result instanceof Error ? [result, null] : [null, result]
  }

  async getChildren(fromPath: string = this.dataDir): Promise<DiffExplorerItem[]> {
    const files = await fs.readdir(fromPath)
    const result = await Promise.all(files.map(async (name) => {
      const filePath = path.join(fromPath, name)
      const stat = await fs.stat(filePath)
      const type = stat.isDirectory() ? DiffExplorerType.folder : DiffExplorerType.file
      return {
        type,
        path: filePath,
        name,
      }
    }))
    return result
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let fileStorage: FileStorageService
export function initializeStorageService() {
  fileStorage = new FileStorageService()
}
