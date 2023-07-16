<template>
    <div class="box">
        <van-nav-bar title="我的" style="margin-bottom: 30px;"></van-nav-bar>
        <van-row justify="center">
            <van-col span="24" style="text-align: center;">
                <van-image height="5rem" round :src="userInfo.user_pic"></van-image>
            </van-col>
        </van-row>
        <van-cell-group inset style="margin-top: 30px;">
            <van-cell is-link title="用户名" @click="showEdit(0)">{{ userInfo.username }}</van-cell>
            <van-cell is-link title="昵称" @click="showEdit(1)">{{ userInfo.nickname }}</van-cell>
            <van-cell is-link title="修改密码" @click="showEdit(2)"></van-cell>
        </van-cell-group>
        <van-cell-group inset style="margin-top: 30px;">
            <van-cell is-link title="编辑标签" @click="showEdit(3)"></van-cell>
        </van-cell-group>
        <van-popup v-model:show="editShow" position="right" :style="{ width: '100%', height: '100%' }">
            <van-nav-bar :title="active===0?'用户名':(active===1?'昵称':(active===2?'修改密码':'编辑标签'))"
             left-arrow @click-left="closeEdit" style="margin-bottom: 30px;"></van-nav-bar>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import defaultAvatar from '../../assets/image/touixang.png'
import { showFailToast } from 'vant/es'
import 'vant/es/image-preview/style'

const { $http } = getCurrentInstance().appContext.config.globalProperties
const avatar = ref(defaultAvatar)

const user = localStorage.getItem("user")
const userInfo = ref({})
const editShow = ref(false)
const active = ref(0)

function showEdit(index) {
    active.value = index
    editShow.value = true
}

function closeEdit() {
    editShow.value = false
}


onMounted(() => {
    $http.get('getUser', {
        params: {
            user: user
        }
    }).then(res => {
        if (res.data.status !== 0) return showFailToast("获取用户信息失败")
        else {
            userInfo.value = { ...res.data.message[0] }
            userInfo.value.username = user
            userInfo.value.nickname = userInfo.value.nickname === null ? user : userInfo.value.nickname
            userInfo.value.user_pic = userInfo.value.user_pic === null ? avatar : userInfo.value.user_pic
        }
    })
})
</script>

<style scoped>
.van-cell {
    font-size: 18px;
}
</style>

