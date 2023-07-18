import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './route'
import axios from 'axios'
import './assets/css/reset.css'
import './assets/font/font.css'
import './assets/iconfont/iconfont.css'
import 'animate.css'
import 'vant/es/toast/style'
import './assets/css/global.css'


const app = createApp(App)

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    error => {
        return Promise.reject(error);
    }
)

app.config.globalProperties.$http = axiosInstance
app.use(createPinia())
app.use(router)
app.mount('#app')