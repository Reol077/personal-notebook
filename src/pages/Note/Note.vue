<template>
    <div class="box">
        <van-nav-bar title="笔记"></van-nav-bar>
        <van-row class="search">
            <van-col class="icon" span="8">
                <van-icon class-prefix="icon" name="dasuolvetuliebiao iconfont"
                    :class="{ isActive: store.gridRowActive == 0 }" @click="store.gridRowActive = 0" />
                <van-icon name="bars" :class="{ isActive: store.gridRowActive == 1 }" @click="store.gridRowActive = 1" />
            </van-col>
            <van-col span="8" style="text-align: center;">
                <van-dropdown-menu class="dropdownCla">
                    <van-dropdown-item v-model="tagVal" :options="tagName" />
                </van-dropdown-menu>
            </van-col>
            <van-col span="8" style="text-align: right;">
                <van-icon name="search" @click="search" />
            </van-col>
        </van-row>
        <van-grid v-if="showArticles.length !== 0">
            <!-- <van-grid class="grid" :column-num="2" :gutter="10" v-if="store.gridRowActive === 0"> -->
            <div class="grid" v-if="store.gridRowActive === 0">
                <!-- <van-grid-item class="note" v-for="(val, index) in showArticles"> -->
                <div class="note" v-for="(val, index) in showArticles">
                    <div @click="editNote(index)" style="width: 100%;">
                        <van-row class="userTime">
                            <van-col span="12" style="text-align: left;">{{ val.nickname !== null ? val.nickname : val.user
                            }}</van-col>
                            <van-col span="12" style="text-align: right;">{{ submitTime(val.submit_time) }}</van-col>
                        </van-row>
                        <van-row class="title">{{ title(val.title) }}</van-row>
                        <van-row class="content">{{ content(val.content) }}</van-row>
                    </div>
                    <van-row class="time" justify="space-between">
                        <div style="display: inline-block;">
                            <i class="iconfont icon-xiugai" style="margin-right: 5px;"></i>
                            {{ timeRow(val.submit_time) }}
                        </div>
                        <i @click="deleteArticle(val.id)" class="iconfont icon-shanchu"></i>
                    </van-row>
                </div>
                <!-- </van-grid-item> -->
            </div>
            <!-- </van-grid> -->
            <van-grid :column-num="1" :gutter="10" v-if="store.gridRowActive === 1">
                <van-grid-item v-for="(val, index) in showArticles" @click="editNote(index)">
                    <van-row class="userTime">
                        <van-col span="12" style="text-align: left;">{{ val.nickname !== null ? val.nickname : val.user
                        }}</van-col>
                        <van-col span="12" style="text-align: right;">{{ submitTime(val.submit_time) }}</van-col>
                    </van-row>
                    <van-row class="title">{{ titleRow(val.title) }}</van-row>
                    <van-row class="content">{{ contentRow(val.content) }}</van-row>
                    <van-row class="time" justify="space-between">
                        <div style="display: inline-block;">
                            <i class="iconfont icon-xiugai" style="margin-right: 5px;"></i>
                            {{ timeRow(val.submit_time) }}
                        </div>
                        <i @click="deleteArticle(val.id)" class="iconfont icon-shanchu"></i>
                    </van-row>
                </van-grid-item>
            </van-grid>
        </van-grid>
        <div v-if="showArticles.length == 0">
            <van-empty description="暂无笔记" />
        </div>
        <van-floating-bubble axis="xy" magnetic="x" v-model:offset="offset" icon="plus"
            @click="Input"></van-floating-bubble>
        <div style="height: 50px;"></div>
        <van-popup v-model:show="showSearch" position="top" @closed="showDeleteHis = false">
            <van-search ref="inputRef" v-model="searchKey" show-action placeholder="请输入标题以搜索" @clear="onClear"
                @search="onSearch" @cancel="onCancel" autocomplete="off" />
            <div class="searchBox" v-if="searchHistory.length !== 0">
                <van-row class="searchHis">
                    <van-col span="2"></van-col>
                    <van-col span="10" style="text-align: left;">搜索历史</van-col>
                    <van-col span="10" style="text-align: right;">
                        <i @click="showDeleteHis = true" v-if="showDeleteHis === false" class="iconfont icon-shanchu"></i>
                        <span v-if="showDeleteHis === true">
                            <span @click="deleteHisAll" class="deleteAll">全部删除</span>
                            <span class="divide">|</span>
                            <span class="deleteCompelete" @click="showDeleteHis = false">完成</span>
                        </span>
                    </van-col>
                    <van-col span=2></van-col>
                </van-row>
                <div class="textHis">
                    <span class="out" v-for="(val, index) in searchHistory"><span @click="changeSearchKey(index)">{{
                        val.search_item
                    }}</span> <van-icon @click="deleteHisItem(index)" v-if="showDeleteHis === true"
                            name="cross" /></span>
                </div>
            </div>
        </van-popup>
        <van-popup v-model:show="store.editShow" position="right" :style="{ width: '100%', height: '100%' }">
            <router-view></router-view>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast, showConfirmDialog, showSuccessToast } from 'vant'
import { useStore } from '../../store/index'
import '@vant/touch-emulator'
import 'vant/es/dialog/style';

const router = useRouter();
const { $http } = getCurrentInstance().appContext.config.globalProperties
const store = useStore()
const bubbleHeight = window.innerHeight - 150
const offset = ref({ x: -20, y: bubbleHeight })
const showSearch = ref(false)
const searchKey = ref('')
const showDeleteHis = ref(false)
const inputRef = ref(null);
const searchHistory = ref([])

const showArticles = ref([])
const articles = ref([])

const tagVal = ref('')
const tagName = computed(() => {
    if (!store.tag) {
        let tagList = []
        $http.get('getTags', { params: { user: localStorage.getItem("user") } }).then(res => {
            let tempList = res.data.tags
            tagList.push({ text: "全部", value: 0 })
            tempList.forEach((item, index) => {
                tagList.push({ text: item.tag, value: item.id })
            })
        }).catch(err => {
            showFailToast(err)
        })
        return tagList
    }
    return ref()
})
function onClickLeft() {
    router.push('/')
}

function Input() {
    router.push('/home/note/input')
    store.edit = false
    store.editShow = true
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
            return '今天内';
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
    router.push('/home/note/input')
    store.editShow = true
}

function search() {
    showSearch.value = true
    getSearchHis()
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
    $http.post('addSearchHis', { user: localStorage.getItem("user"), search_item: searchKey.value }).then(res => {
        if (res.data.status !== 0) return showFailToast("记录搜索记录失败")
    }).catch(err => {
        return showFailToast(err)
    })
}

function onCancel() {
    reset()
}


function getArticle() {
    $http.get('getArticle', { params: { user: localStorage.getItem("user") } }).then(res => {
        if (res.data.status !== 0) return showFailToast(res.data.message)
        articles.value = res.data.message
        showArticles.value = articles.value
        tagVal.value = store.tagId
    }).catch(err => {
        showFailToast(err)
    })
}

function getSearchHis() {
    $http.get('getSearchHis', { params: { user: localStorage.getItem("user") } }).then(res => {
        if (res.data.status !== 0) return showFailToast("获取历史记录失败")
        else {
            searchHistory.value = res.data.message
        }
    }).catch(err => {
        showFailToast(err)
    })
}

function changeSearchKey(index) {
    searchKey.value = searchHistory.value[index].search_item
    inputRef.value.focus();
}

function deleteArticle(id) {
    showConfirmDialog({
        title: '确认删除',
    }).then(() => {
        $http.delete('deleteArticle', { params: { id: id } }).then(res => {
            if (res.data.status !== 0) return showFailToast(res.data.message)
            showSuccessToast(res.data.message)
            getArticle()
        }).catch(err => {
            showFailToast(err)
        })
    })
}

function deleteHisItem(index) {
    $http.delete('deleteSearchHis', { params: { id: searchHistory.value[index].id } }).then(res => {
        if (res.data.status !== 0) return showFailToast("删除失败")
    })
    getSearchHis()
}

function deleteHisAll() {
    $http.delete('deleteSearchHisAll', { params: { user: localStorage.getItem("user") } }).then(res => {
        if (res.data.status !== 0) return showFailToast("删除失败")
    })
    getSearchHis()
}

watch(tagVal, (newVal, oldVal) => {
    $http.get('getArticleByTag', {
        params: {
            user: localStorage.getItem("user"),
            tag: newVal === 0 ? '' : tagName.value[tagName.value.findIndex(item => item.value === newVal)].text
        }
    }).then(res => {
        articles.value = res.data.message
        showArticles.value = articles.value
        store.tagId = newVal
    }).catch(err => {
        showFailToast(err)
    })
})


watch(
    computed(() => {
        return store.editShow
    }),
    (newVal, oldVal) => {
        getArticle()
    })

onMounted(() => {
    getArticle()
})
</script>

<style lang="scss">
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

.searchBox {
    .searchHis {
        font-size: 12px;
        width: 100%;
        margin: 10px 0;

        .deleteAll {
            display: inline-block;
            margin-right: 5px;
            color: gray;
        }

        .divide {
            color: gray;
        }

        .deleteCompelete {
            display: inline-block;
            margin-left: 5px;
        }
    }

    .textHis {
        margin: 10px 20px;

        .out {
            display: inline-block;
            border: 1px solid rgb(240, 240, 240);
            border-radius: 25px;
            padding: 10px;
            margin: 2px 5px;
            font-size: 12px;
        }

        .van-icon {
            margin-left: 5px;
        }
    }


}

.grid{
    column-count: 2;
    column-gap: 0;

    .note{
        break-inside: avoid;
        margin: 5px;
        padding: 20px;
        background: white;
        border-radius: 5px;
        width: calc(50vw - 52px);
        
    }
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

.delete {
    width: 100%;

    i {
        display: inline-block;
        width: 100%;
        text-align: right;
        font-size: 12px;
    }
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

.dropdownCla {
    display: inline-block;

    .van-dropdown-menu__bar {
        background-color: var(--backgroung-color-gray);
        box-shadow: none;

        .van-ellipsis {
            font-size: 18px;
        }

    }
}
</style>
