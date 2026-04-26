import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.scss'
// permission control
import './permission'
import { auth } from './directive'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.directive('auth', auth)
app.mount('#app')
