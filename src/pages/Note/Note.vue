<template>
    <div>
        <van-nav-bar title="笔记"></van-nav-bar>
        <van-floating-bubble axis="xy" magnetic="x" v-model:offset="offset" icon="plus"
            @click="Input"></van-floating-bubble>

    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant';

const router = useRouter();
const { $http } = getCurrentInstance().appContext.config.globalProperties

const offset = ref({ x: -20, y: 600 })

const articles = ref([])
function onClickLeft() {
    router.push('/')
}

function Input() {
    router.push('/home/input')
}

onMounted(() => {
    $http.get('getArticle', { params: { user: localStorage.getItem("user") } }).then(res => {
        res.data.message.forEach(item => {
            const tempData = new Date(item.submit_time)
            item.submit_time = tempData.toLocaleString()
        });
        articles.value = res.data.message
    }).catch(err => {
        showFailToast(err)
    })
})
</script>

<style lang="scss" scoped></style>
