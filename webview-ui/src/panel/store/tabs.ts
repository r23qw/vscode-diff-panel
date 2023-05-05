import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getId } from '../../utilities/helper'

interface Tab {
  id: string
  title: string
  left: string
  right: string
}

export const useTabs = defineStore('tabs', () => {
  const initState: Tab[] = [{ id: getId(), title: 'Untitled', left: '', right: '' }]

  const tabs = ref(initState)

  const deleteTab = (id: string) => {
    if (tabs.value.length === 1)
      return

    const index = tabs.value.findIndex(tab => tab.id === id)
    if (index > -1)
      tabs.value.splice(index, 1)
  }
  const currentTabId = ref(initState[0].id)

  const setCurrentTabId = (id: string) => {
    currentTabId.value = id
  }

  const addTab = () => {
    const id = getId()
    tabs.value.push({ id, title: 'Untitled', left: '', right: '' })
    setCurrentTabId(id)
  }

  return { tabs, addTab, deleteTab, currentTabId, setCurrentTabId }
})
