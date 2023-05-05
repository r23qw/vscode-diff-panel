import 'virtual:uno.css'
import { createApp, watch } from 'vue'
import { allComponents, provideVSCodeDesignSystem } from '@vscode/webview-ui-toolkit'
import { createPinia } from 'pinia'
import { vscode } from '../utilities/vscode'
import App from './App.vue'
import './index.css'

// TODO: reigster components on-demand
provideVSCodeDesignSystem().register(allComponents)

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

pinia.state.value = window.__STATE__

watch(
  pinia.state,
  (state) => {
    vscode.setState(state)
  },
  { deep: true },
)

app.mount('#app')
