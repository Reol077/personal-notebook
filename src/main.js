import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './route'
import axios from 'axios'
import './assets/css/reset.css'
import './assets/font/font.css'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import 'animate.css'
import 'vant/es/toast/style'


const app = createApp(App)

if (localStorage.getItem("token") === null) localStorage.setItem("token", "")
const token = localStorage.getItem("token")
const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        common: {
            Authorization: token
        }
    }
})

app.config.globalProperties.$http = axiosInstance
app.use(createPinia())
app.use(router)
app.mount('#app')
