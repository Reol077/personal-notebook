<template>
    <div class="box">
        <van-nav-bar title="标签"></van-nav-bar>
        <van-grid :column-num="3">
            <van-grid-item v-for="(val, index) in tagList" :style="{ 'color': '#' + val.color }"
                @click="showTagArticle(val.id)">
                <span class="itemFont">{{ val.tag }}</span>
            </van-grid-item>
            <van-grid-item @click="showPopup = true">
                <span><van-icon name="plus" style="margin-right: 10px;" />标签</span>
            </van-grid-item>
        </van-grid>
        <van-popup v-model:show="showPopup" position="top">
            <van-form @submit="onSubmit" style="margin-bottom: 10px;">
                <van-nav-bar title="新建标签" right-text="添加" @click-right="onSubmit"></van-nav-bar>
                <van-field v-model="tagName" placeholder="请输入标签名称"></van-field>
                <van-cell title="选择标签颜色" :style="fontColor">
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="colorVal" :options="colorName" />
                    </van-dropdown-menu>
                </van-cell>
            </van-form>
        </van-popup>
        <div style="height: 50px;"></div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance, computed, onMounted, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant/es'
import { storeToRefs } from 'pinia';

import { useStore } from '../../store/index'


const router = useRouter()
const store = useStore()
const { $http } = getCurrentInstance().appContext.config.globalProperties

const tagList = ref([])

const showPopup = ref(false)
const tagName = ref('')
const colorVal = ref('000000')
const colorName = ref([
    { text: '朴素黑', value: '000000' },
    { text: '天青石', value: '4266f4' },
    { text: '靛蓝色', value: '223066' },
    { text: '玻璃绿', value: '006a4f' },
    { text: '冰绿色', value: '7ddac3' },
    { text: '莓红色', value: 'b5485b' },
    { text: '酥芳红', value: '8e354b' },
])

const loop = ref('')

const fontColor = computed(() => {
    return { 'color': '#' + colorVal.value + ' !important' }
})

function onSubmit() {
    if (tagName.value === '') {
        showFailToast("请输入标签名称")
        return
    }
    const tag = {
        user: localStorage.getItem("user"),
        tag: tagName.value,
        color: colorVal.value
    }
    $http.post('addTags', tag).then(res => {
        if (res.data.status !== 0) {
            showFailToast(res.data.message)
        } else {
            getTags()
            showSuccessToast(res.data.message)
            showPopup.value = false
        }
    })
}

function getTags() {
    $http.get('getTags', { params: { user: localStorage.getItem("user") } }).then(res => {
        tagList.value = res.data.tags
    }).catch(err => {
        showFailToast(err)
    })
}

function showTagArticle(id) {
    store.tagId = id
    router.push('/home/note')
}
onMounted(() => {
    getTags()
})

</script>

<style lang="scss" scoped>
.box {
    height: 100vh;
    background: var(--backgroung-color-gray);
    overflow: auto;

    .van-grid {
        .van-grid-item {
            padding: 10px;

            .itemFont {
                font-weight: bold;
            }
        }
    }
}
</style>