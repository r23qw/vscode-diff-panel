<script setup lang="ts">
import { onMounted } from 'vue'
import { createEditor } from '../helper/editor'

onMounted(() => {
  createEditor()
})
</script>

<template>
  <div id="editor" class="grow-1" />
</template>

<style scoped>

</style>
