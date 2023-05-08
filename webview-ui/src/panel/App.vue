<script setup lang="ts">
import type { Message } from '../../../shared/message'

// import { vscode } from '../utilities/vscode'
import Operator from './components/Operator.vue'
import Editor from './components/Editor.vue'
import Tabs from './components/Tabs.vue'

window.addEventListener('message', (e: MessageEvent<Message>) => {
/*   vscode.postMessage({
    type:'command'
    command: 'alert',
    payload: JSON.stringify({ message: 'Hello from Vue!' }),
  }) */
})
</script>

<template>
  <main class="flex flex-col h-full">
    <Tabs />
    <Operator />
    <Editor />
  </main>
</template>

<style scoped>

</style>
