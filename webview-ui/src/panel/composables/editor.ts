import type { editor } from 'monaco-editor'
import type { Monaco } from '@monaco-editor/loader'
import loader from '@monaco-editor/loader'
import type { Ref } from 'vue'
import { onMounted, ref, shallowRef } from 'vue'
import { useMutationObserver } from '@vueuse/core'

loader.config({ paths: { vs: 'https://www.unpkg.com/monaco-editor@0.37.1/min/vs' } })

let monaco: Monaco | null = null

function loadMonaco() {
  return loader.init().then(m => monaco = m)
}

type theme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
type themeKind = 'vscode-light' | 'vscode-dark' | 'vscode-high-contrast' | 'vscode-high-contrast-light'
function getThemeByKind(themeKind: themeKind): theme {
  const themeKindMap: Record<themeKind, theme> = {
    'vscode-light': 'vs',
    'vscode-dark': 'vs-dark',
    'vscode-high-contrast': 'hc-black',
    'vscode-high-contrast-light': 'hc-light',
  }
  return themeKindMap[themeKind]
}

export function createEditor(monaco: Monaco, container: HTMLElement, theme: theme) {
  const editor = monaco.editor.createDiffEditor(
    container,
    {
      theme,
      originalEditable: true,
      automaticLayout: true,
    },
  )
  const leftModel = monaco.editor.createModel(
    'hello world',
    'text/plain',
  )
  const rightModel = monaco.editor.createModel(
    'Hello World',
    'text/plain',
  )
  editor.setModel({
    original: leftModel,
    modified: rightModel,
  })
  return { editor, leftModel, rightModel }
}
export function useEditor(container: Ref<HTMLElement | null>) {
  const loading = ref(false)
  const editor = shallowRef<editor.IStandaloneDiffEditor | null> (null)
  const leftModel = shallowRef<editor.ITextModel | null>(null)
  const rightModel = shallowRef<editor.ITextModel | null>(null)

  onMounted(async () => {
    loading.value = true
    await loadMonaco()
    loading.value = false

    if (!monaco || !container.value)
      return

    const themeKind = document.body.dataset.vscodeThemeKind as themeKind
    const result = createEditor(monaco, container.value, getThemeByKind(themeKind))

    editor.value = result.editor
    leftModel.value = result.leftModel
    rightModel.value = result.rightModel
  })

  // theme change
  useMutationObserver(document.body, (mutation) => {
    const themeMutation = mutation.find(i => i.attributeName === 'data-vscode-theme-kind')
    if (themeMutation) {
      const themeKind = (themeMutation.target as HTMLElement).dataset.vscodeThemeKind as themeKind
      if (themeKind)
        monaco?.editor.setTheme(getThemeByKind(themeKind))
    }
  }, { attributes: true })

  return {
    loading,
    editor,
    leftModel,
    rightModel,
  }
}
