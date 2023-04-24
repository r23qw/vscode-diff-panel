<script setup lang="ts">
import NewDiffEditorButton from './components/NewDiffEditorButton.vue'
import Panel from './components/Panel.vue'
</script>

<template>
  <main class="flex flex-col">
    <NewDiffEditorButton />
    <Panel />
  </main>
</template>

<style>
body{
  padding: 20px;
}
html{
  background-color: var(--background)
}
</style>
