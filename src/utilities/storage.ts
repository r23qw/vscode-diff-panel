import * as path from 'node:path'
import type { ExtensionContext } from 'vscode'
import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import { getExtensionContext } from '../extension'
import type { DiffExplorerItem } from '../../shared/state'
import { DiffExplorerType } from '../../shared/state'
import { logger } from './log'
import { showErrorMessage } from './message'

class FileStorageService {
  context: ExtensionContext = getExtensionContext()
  storageUrl: string = this.context.globalStorageUri.path
  dataDir = path.join(this.storageUrl, 'data')

  constructor() {
    this.initilize().catch(error => console.error(error))
  }

  async initilize() {
    const hasDataDir = await fs.pathExists(this.dataDir)
    if (!hasDataDir)
      await fs.ensureDir(this.dataDir)
  }

  async createFile() {
    const filename = await vscode.window.showInputBox({
      placeHolder: 'please input filename',
      title: 'filename',
      prompt: 'recommand with file extension name',
    })
    if (!filename)
      return
    const filePath = path.join(this.dataDir, filename)
    const existPath = await fs.exists(filePath)

    if (existPath) {
      showErrorMessage('file or folder already exist, please choose different name.')
      return
    }

    fs.createFile(filePath).catch((e: Error) => {
      logger.error(e)
      showErrorMessage(`create file failed: ${e.message}`)
    })
  }

  createDir() {}
  deleteFile() {}
  deleteDir() {}
  async getChildren(fromPath: string = this.dataDir): Promise<DiffExplorerItem[]> {
    const files = await fs.readdir(fromPath)
    const result = await Promise.all(files.map(async (name) => {
      const filePath = path.join(fromPath, name)
      const stat = await fs.stat(filePath)
      return {
        type: stat.isDirectory() ? DiffExplorerType.floder : DiffExplorerType.file,
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
