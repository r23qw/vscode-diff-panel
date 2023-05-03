<script setup lang="ts">
import Operator from './components/Operator.vue'
import Editor from './components/Editor.vue'
import Tabs from './components/Tabs.vue'
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
