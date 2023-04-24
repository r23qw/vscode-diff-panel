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
      <div class="flex gap-4px w-full">
        <vscode-text-field placeholder="Search" class="grow-1" />
        <vscode-button appearance="icon">
          <span class="codicon codicon-list-filter" />
        </vscode-button>
        <vscode-button appearance="icon">
          <span class="codicon codicon-new-file" />
        </vscode-button>
      </div>
    </vscode-panel-view>
    <vscode-panel-view>
      <div class="flex gap-4px w-full">
        <vscode-text-field placeholder="Search" class="grow-1" />
        <vscode-button appearance="icon">
          <span class="codicon codicon-list-filter" />
        </vscode-button>
        <vscode-button appearance="icon">
          <span class="codicon codicon-new-file" />
        </vscode-button>
        <vscode-button appearance="icon">
          <span class="codicon codicon-new-folder" />
        </vscode-button>
      </div>
    </vscode-panel-view>
  </vscode-panels>
</template>

<style scoped>
vscode-panel-tab{
  --at-apply: focus:border-color-transparent;
}
vscode-panels::part(activeIndicator){
  background-color: var(--panel-tab-active-border);
}
vscode-panel-view{
  padding-left: 0;
  padding-right: 0;
}
</style>
