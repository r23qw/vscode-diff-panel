import * as path from 'node:path'
import type { ExtensionContext } from 'vscode'
import * as fs from 'fs-extra'
import * as vscode from 'vscode'
import { getExtensionContext } from '../extension'
import type { GlobalState } from '../../shared/state'
import { initGlobalState } from '../../shared/state'

class StorageService {
  context: ExtensionContext = getExtensionContext()
  storageUrl: string = this.context.globalStorageUri.path
  dataFilename = 'data.json'
  dataFilePath = path.join(this.storageUrl, this.dataFilename)
  data: GlobalState = initGlobalState
  constructor() {
    this.initilize().catch(error => console.error(error))
  }

  async initilize() {
    const hasDataFile = await fs.pathExists(this.dataFilePath)
    if (hasDataFile)
      await fs.readJson(this.dataFilePath).then((data: GlobalState) => { this.data = data })
    else
      await fs.writeJSON(this.dataFilePath, this.data)
  }

  save() {
    fs.writeJSON(this.dataFilePath, this.data).catch((error: Error) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      vscode.window.showErrorMessage(`[Diff Panel]: Save Error cause ${error.message}`)
    })
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let storage: StorageService
export function initializeStorageService() {
  storage = new StorageService()
}
