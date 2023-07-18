<template>
    <div class="page">
        <router-view></router-view>
        <van-tabbar route>
            <van-tabbar-item replace to="/home/note" :icon="noteIcon('/home/note')">笔记</van-tabbar-item>
            <van-tabbar-item replace to="/home/class" :icon="classIcon('/home/class')">分类</van-tabbar-item>
            <van-tabbar-item replace to="/home/mine" :icon="mineIcon('/home/mine')">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from '../store/index'

const router = useRouter()
const store = useStore()

function noteIcon(path) {
    if (router.currentRoute.value.fullPath === path) {
        return 'bookmark';
    } else {
        return 'bookmark-o';
    }
}

function classIcon(path) {
    if (router.currentRoute.value.fullPath === path) {
        return 'award';
    } else {
        return 'award-o';
    }
}

function mineIcon(path) {
    if (router.currentRoute.value.fullPath === path) {
        return 'wap-home';
    } else {
        return 'home-o';
    }
}
</script>

<style scoped>
.page {
    position: absolute;
}
</style>

