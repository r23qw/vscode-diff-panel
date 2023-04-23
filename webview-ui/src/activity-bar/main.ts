import 'virtual:uno.css'
import { createApp } from 'vue'
import { allComponents, provideVSCodeDesignSystem } from '@vscode/webview-ui-toolkit'
import App from './App.vue'
import '../../public/codicon.css'

// TODO: reigster components on-demand
provideVSCodeDesignSystem().register(allComponents)

createApp(App).mount('#app')
