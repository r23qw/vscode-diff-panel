<script lang="ts" setup>
import { ref } from 'vue'
import { useTabs } from '../store/tabs'

const tabsStore = useTabs()

const panel = ref(null)

function handleChange(e: CustomEvent) {
  tabsStore.setCurrentTabId(e.detail.id)
}
</script>

<template>
  <div class="flex">
    <vscode-panels
      ref="panel" class="grow-1"
      :activeid="tabsStore.currentTabId"
      @change="handleChange"
    >
      <vscode-panel-tab v-for="tab in tabsStore.tabs" :id="tab.id" :key="tab.id" class="pl-[3px]">
        {{ tab.title }}
        <vscode-button appearance="icon" class="ml-4" @click="tabsStore.deleteTab(tab.id)">
          <span class="codicon codicon-close" />
        </vscode-button>
      </vscode-panel-tab>
      <vscode-panel-view v-for="tab in tabsStore.tabs" :id="tab.id" :key="tab.id" class="hidden" />
    </vscode-panels>
    <vscode-button appearance="primary" class="shrink-0 ml-4" @click="tabsStore.addTab">
      New Tab
    </vscode-button>
  </div>
</template>

<style lang="scss" scoped>

</style>
