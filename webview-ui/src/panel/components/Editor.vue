<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { useEditor } from '../composables/editor'

const editorRef = ref<HTMLElement | null>(null)
const { loading } = useEditor(editorRef as Ref<HTMLElement | null>)
</script>

<template>
  <div class="grow-1 relative">
    <vscode-progress-ring v-if="loading" class="absolute top-50% left-50% translate--50%" />
    <div ref="editorRef" class="h-full" />
  </div>
</template>

<style scoped>

</style>
