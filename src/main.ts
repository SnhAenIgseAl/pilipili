import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import './global.css'
import App from './App.vue'
import './assets/iconfont/iconfont.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import longzeVideoPlay from "longze-vue3-video-player";
// import 'vue3-video-play/dist/style.css'



const app = createApp(App)



const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)



app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(longzeVideoPlay)
app.mount('#app')
