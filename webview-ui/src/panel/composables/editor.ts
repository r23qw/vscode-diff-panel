import type { editor } from 'monaco-editor'
import type { Monaco } from '@monaco-editor/loader'
import loader from '@monaco-editor/loader'
import type { Ref, ShallowRef } from 'vue'
import { onMounted, ref, shallowRef } from 'vue'

loader.config({ paths: { vs: 'https://www.unpkg.com/monaco-editor@0.37.1/min/vs' } })

let monaco: Monaco | null = null

function loadMonaco() {
  return loader.init().then(m => monaco = m)
}

export function createEditor(monaco: Monaco, container: HTMLElement) {
  const editor = monaco.editor.createDiffEditor(
    container,
    {
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
  const editor: ShallowRef<editor.IStandaloneDiffEditor | null> = shallowRef(null)
  const leftModel: ShallowRef<editor.ITextModel | null> = shallowRef(null)
  const rightModel: ShallowRef<editor.ITextModel | null> = shallowRef(null)

  onMounted(async () => {
    loading.value = true
    await loadMonaco()
    loading.value = false

    if (!monaco || !container.value)
      return

    const result = createEditor(monaco, container.value)

    editor.value = result.editor
    leftModel.value = result.leftModel
    rightModel.value = result.rightModel
  })
  return {
    loading,
    editor,
    leftModel,
    rightModel,
  }
}
