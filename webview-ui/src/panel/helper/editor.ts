import * as monaco from 'monaco-editor'

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    const getWorkerModule = (moduleUrl: string, label: string) => {
      const scriptUrl = self?.MonacoEnvironment?.getWorkerUrl?.(moduleUrl, '') || ''

      return new Worker(scriptUrl, {
        name: label,
        type: 'module',
      })
    }

    switch (label) {
      case 'json':
        return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label)
      case 'css':
      case 'scss':
      case 'less':
        return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label)
      case 'html':
      case 'handlebars':
      case 'razor':
        return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label)
      case 'typescript':
      case 'javascript':
        return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label)
      default:
        return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label)
    }
  },
}

export function createEditor() {
  return monaco.editor.create(document.getElementById('editor')!, {
    value: 'function hello() {\n\talert(\'Hello world!\');\n}',
    language: 'javascript',
  })
}
