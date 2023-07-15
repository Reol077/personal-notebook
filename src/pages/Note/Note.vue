<template>
    <div class="box">
        <van-nav-bar title="笔记"></van-nav-bar>
        <van-row class="search">
            <van-col class="icon">
                <van-icon class-prefix="icon" name="dasuolvetuliebiao iconfont" :class="{ isActive: store.gridRowActive == 0 }"
                    @click="store.gridRowActive = 0" />
                <van-icon name="bars" :class="{ isActive: store.gridRowActive == 1 }" @click="store.gridRowActive = 1" />
            </van-col>
            <van-col>
                <van-icon name="search" @click="search" />
            </van-col>
        </van-row>
        <div v-if="showArticles.length !== 0">
            <van-grid :column-num="2" :gutter="10" v-if="store.gridRowActive === 0">
                <van-grid-item v-for="(val, index) in showArticles" @click="editNote(index)">
                    <van-row class="userTime">
                        <van-col span="12" style="text-align: left;">{{ val.user }}</van-col>
                        <van-col span="12" style="text-align: right;">{{ submitTime(val.submit_time) }}</van-col>
                    </van-row>
                    <van-row class="title">{{ title(val.title) }}</van-row>
                    <van-row class="content">{{ content(val.content) }}</van-row>
                </van-grid-item>
            </van-grid>
            <van-grid :column-num="1" :gutter="10" v-if="store.gridRowActive === 1">
                <van-grid-item v-for="(val, index) in showArticles" @click="editNote(index)">
                    <van-row class="title">{{ titleRow(val.title) }}</van-row>
                    <van-row class="content">{{ contentRow(val.content) }}</van-row>
                    <van-row class="time"><i class="iconfont icon-xiugai" style="margin-right: 5px;"></i> {{
                        timeRow(val.submit_time) }}</van-row>
                </van-grid-item>
            </van-grid>
        </div>
        <div v-if="showArticles.length == 0">
            <van-empty description="暂无笔记" />
        </div>
        <van-floating-bubble axis="xy" magnetic="x" v-model:offset="offset" icon="plus"
            @click="Input"></van-floating-bubble>
        <div style="height: 50px;"></div>
        <van-popup v-model:show="showSearch" position="top">
            <van-search v-model="searchKey" show-action placeholder="请输入搜索关键词" @clear="onClear" @search="onSearch"
                @cancel="onCancel" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { useStore } from '../../store/index'
import '@vant/touch-emulator'


const router = useRouter();
const { $http } = getCurrentInstance().appContext.config.globalProperties
const store = useStore()
const bubbleHeight = window.innerHeight - 150
const offset = ref({ x: -20, y: bubbleHeight })
const showSearch = ref(false)
const searchKey = ref('')

const showArticles = ref([])
const articles = ref([])
function onClickLeft() {
    router.push('/')
}

function Input() {
    router.push('/home/input')
}

const title = computed(() => {
    return function (title) {
        const maxLength = 5
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + '...'
        }
        return title
    }
})

const content = computed(() => {
    return function (content) {
        const maxLength = 50
        if (content.length > maxLength) {
            return content.slice(0, maxLength) + '...'
        }
        return content
    }
})

const titleRow = computed(() => {
    return function (title) {
        const maxLength = 10
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + '...'
        }
        return title
    }
})

const contentRow = computed(() => {
    return function (content) {
        const maxLength = 20
        if (content.length > maxLength) {
            return content.slice(0, maxLength) + '...'
        }
        return content
    }
})

const submitTime = computed(() => {
    return function (submitTime) {
        const tempData = new Date(submitTime)
        return tempData.toLocaleDateString()
    }
})

const timeRow = computed(() => {
    return function (time) {
        const now = new Date()
        const temp = new Date(time)

        const diff = now - temp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) {
            return '刚刚';
        } else if (minutes <= 5) {
            return '5分钟内';
        } else if (minutes <= 10) {
            return '10分钟内';
        } else if (minutes <= 30) {
            return '半小时内';
        } else if (hours <= 3) {
            return '3小时内';
        } else if (hours <= 24) {
            return '一天内';
        } else if (days === 1) {
            return '昨天';
        } else if (days === 2) {
            return '前天';
        } else {
            const year = temp.getFullYear();
            const month = String(temp.getMonth() + 1).padStart(2, '0');
            const date = String(temp.getDate()).padStart(2, '0');
            return `${year}-${month}-${date}`;
        }
    }
})

function editNote(index) {
    store.note = showArticles.value[index]
    store.edit = true
    router.push('/home/input')
}

function search() {
    showSearch.value = true
}

function reset() {
    showArticles.value = articles.value
    showSearch.value = false
}

function onClear() {
    reset()
}

function onSearch() {
    if (searchKey.value === '') {
        showArticles.value = articles.value
        return
    }
    const titleList = showArticles.value.map(item => item.title)
    const key = searchKey.value.toLowerCase()
    const indexList = titleList.reduce((indexes, title, index) => {
        if (title.toLowerCase().includes(key)) {
            indexes.push(index)
        }
        return indexes
    }, [])
    showArticles.value = indexList.map(index => showArticles.value[index])
    showSearch.value = false
}

function onCancel() {
    reset()
}

onMounted(() => {
    $http.get('getArticle', { params: { user: localStorage.getItem("user") } }).then(res => {
        articles.value = res.data.message
        showArticles.value = articles.value
    }).catch(err => {
        showFailToast(err)
    })
})
</script>

<style lang="scss" scoped>
.box {
    height: 100vh;
    background: rgb(245, 245, 245);
    overflow: auto;
}

.icon {
    font-size: 24px;

    >* {
        margin: 1px;
    }

    .isActive {
        color: rgb(25, 137, 250);
    }
}

.search {
    padding: 20px;
    font-size: 24px;
    justify-content: space-between;
}

.userTime {
    font-size: 12px;
    width: 100%;
    margin-bottom: 10px;
}

.title {
    width: 100%;
    text-align: right;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.content {
    width: 100%;
    text-align: left;
    font-size: 16px;
    word-break: break-all;
    margin-bottom: 10px;
}

.time {
    width: 100%;
    text-align: left;
    font-size: 14px;
    color: gray;

    i {
        font-size: 12px;
    }
}
</style>
