<script lang="ts" setup>
import { vscode } from '../utilities/vscode'

function handleClick() {
  vscode.postMessage({
    type: 'command',
    command: 'newDiffEditor',
    payload: [],
  })
}
</script>

<template>
  <vscode-button class="w-full" @click="handleClick">
    New Diff Editor
  </vscode-button>
</template>

<style lang="scss" scoped>

</style>
