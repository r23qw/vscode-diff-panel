<script setup lang="ts">

</script>

<template>
  <vscode-panels activeid="Activity" aria-label="With Active Tab">
    <vscode-panel-tab id="Activity">
      Activity
    </vscode-panel-tab>
    <vscode-panel-tab id="Saved">
      Saved
    </vscode-panel-tab>
    <vscode-panel-view>
      Problems Content
    </vscode-panel-view>
    <vscode-panel-view>
      Output Content
    </vscode-panel-view>
  </vscode-panels>
</template>

<style>
vscode-panels .tablist{
  width: 100%;
}
</style>
