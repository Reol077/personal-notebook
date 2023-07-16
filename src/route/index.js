import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    { path: '/', redirect: "/login" },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/Login.vue'),
    },
    {
        path: '/home',
        name: "home",
        component: () => import('../pages/Home.vue'),
        children: [
            { path: '/home', redirect: '/home/note' },
            { path: '/home/note', component: () => import('../pages/Note/Note.vue') },
            { path:'/home/class', component: () => import('../pages/class/Class.vue')},
        ]
    },
    {
        path: "/home/input",
        name: 'input',
        component: () => import('../pages/Note/NoteInput.vue'),
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const token = localStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router