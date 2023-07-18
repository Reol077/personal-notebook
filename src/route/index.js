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
        /*
        meta: {
            enterClass: "animate__animated animate__fadeIn",
            leaveClass: "animate__animated animate__fadeOutRight"
        },
        */
        children: [
            { path: '/home', redirect: '/home/note' },
            {
                path: '/home/note',
                component: () => import('../pages/Note/Note.vue'),
                children: [
                    { path: '/home/note/input', component: () => import('../pages/Note/NoteInput.vue') }
                ]
            },
            {
                path: '/home/class',
                component: () => import('../pages/Class/Class.vue'),
            },
            { path: '/home/mine', component: () => import('../pages/Mine/Mine.vue') },
        ]
    },
    /*
    {
        path: "/home/input",
        name: 'input',
        component: () => import('../pages/Note/NoteInput.vue'),
        meta: {
            enterClass: "animate__animated animate__fadeInRight",
            leaveClass: "animate__animated animate__fadeOut"
        }
    },
    */
]
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.path === '/login') {
        if (token) return next('/home')
        else return next()
    }
    if (!token) return next('/login')
    next()
})

export default router