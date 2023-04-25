<script setup lang="ts">
import { vscode } from '../utilities/vscode'
import Operator from './components/Operator.vue'
import Editor from './components/Editor.vue'

vscode.setState({ left: 'left', right: 'right' })
console.log(vscode)
</script>

<template>
  <main class="flex flex-col h-full">
    <Operator />
    <Editor />
  </main>
</template>

<style scoped>

</style>
