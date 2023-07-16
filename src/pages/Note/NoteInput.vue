<template>
    <div class="page">
        <van-nav-bar title="录入" left-arrow right-text="发布" @click-left="backHome" @click-right="submit"></van-nav-bar>
        <van-form>
            <van-cell-group inset>
                <van-field :placeholder="showHeader" readonly class="header"></van-field>
                <van-field v-model="note.title" autosize type="textarea" placeholder="请输入标题" autocomplete="off"
                    class="title"></van-field>
                <van-field v-model="note.content" autosize type="textarea" maxlength="50000" placeholder="请输入正文"
                    class="content" />
            </van-cell-group>
            <div class="fixed-bottom">
                <van-grid :column-num="3" :gutter="10" style="margin-top: 10px;">
                    <van-grid-item v-for="(val, index) in outSelectedTags"><span>{{ val }}<van-icon name="cross"
                                class="deleteIcon" @click="deleteOutSelectedTags(index)" /></span></van-grid-item>
                    <van-grid-item @click="showTags" v-if="outSelectedTagsLength < 3"><span><van-icon name="plus"
                                style="margin-right: 10px;" />添加标签</span></van-grid-item>
                </van-grid>
            </div>
        </van-form>
        <van-popup v-model:show="showTagsPopup" position="bottom" :style="{ height: '40%' }" @close="cancelAdd">
            <van-nav-bar title="选择标签" left-arrow @click-left="cancelAdd" right-text="添加"
                @click-right="addOutSelectedTags"></van-nav-bar>
            <van-grid :column-num="3" :gutter="10" style="margin-top: 10px;">
                <van-grid-item v-for="(val, index) in innerSelectedTags"><span>{{ val }}<van-icon name="cross"
                            class="deleteIcon" @click="deleteInnerSelectedTags(index)" /></span></van-grid-item>
            </van-grid>
            <van-search v-model="search" placeholder="请输入要搜索的标签" @search="onSearch" />
            <van-grid :column-num="3" :gutter="10">
                <van-grid-item v-for="(val, index) in tagsToDisplay" @click="addInnerSelectedTags(index)">{{ val
                }}</van-grid-item>
            </van-grid>
        </van-popup>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance, computed, onMounted, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant/es';
import { useStore } from '../../store/index'


const router = useRouter()
const { $http } = getCurrentInstance().appContext.config.globalProperties
const store = useStore()

const note = ref({
    title: "",
    content: "",
})

const tags = ref([])
const tagsShow = ref([])
const tagsShowSearch = ref([])
const searchIndexInShow = ref([])

const showTagsPopup = ref(false)
const innerSelectedTags = ref([])
const outSelectedTags = ref([])

const search = ref("")

const now = new Date()
const year = now.getFullYear().toString().slice(-2)
const month = ('0' + (now.getMonth() + 1)).slice(-2)
const day = ('0' + now.getDate()).slice(-2)
const hours = ('0' + now.getHours()).slice(-2)
const minutes = ('0' + now.getMinutes()).slice(-2)
const seconds = ('0' + now.getSeconds()).slice(-2)
const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

const outSelectedTagsLength = computed(() => {
    return outSelectedTags.value.length
})

const showHeader = computed(() => {
    const chineseRegex = /[\u4e00-\u9fa5]/g
    const chineseChars = note.value.content.match(chineseRegex)
    const chineseCount = chineseChars ? chineseChars.length : 0

    const wordRegex = /\b([A-Za-z]+[’'-]?[A-Za-z]+)\b/g
    const words = note.value.content.match(wordRegex)
    const wordCount = words ? words.length : 0;

    const totalCount = chineseCount + wordCount

    return `${year}/${month}/${day} ${hours}:${minutes} | ${totalCount}字`
})

function backHome() {
    store.note = {}
    router.push('/home')
    store.editShow = false
}

function showTags() {
    showTagsPopup.value = true
    innerSelectedTags.value = Array.from(outSelectedTags.value)
    if (tags.value.length === 0) {
        $http.get('getTags', { params: { user: localStorage.getItem("user") } }).then(res => {
            tags.value = res.data.tags.map(obj => obj.tag)
            tagsShow.value = tags.value
            tagsShow.value = tagsShow.value.filter(item => !outSelectedTags.value.includes(item));
        }).catch(err => {
            showFailToast(err)
        })
    }
}

function addInnerSelectedTags(index) {
    if (tagsShowSearch.value.length > 0) {
        innerSelectedTags.value.push(tagsShowSearch.value[index])
        tagsShowSearch.value.splice(index, 1)
        tagsShow.value.splice(searchIndexInShow.value[index], 1)
    } else {
        innerSelectedTags.value.push(tagsShow.value[index])
        tagsShow.value.splice(index, 1)
    }

}

function deleteInnerSelectedTags(index) {
    tagsShow.value.push(innerSelectedTags.value[index])
    innerSelectedTags.value.splice(index, 1)
}

function addOutSelectedTags() {
    if (innerSelectedTags.value.length > 3) {
        showFailToast("最多只能添加三个标签")
        return
    } else {
        outSelectedTags.value = innerSelectedTags.value
        innerSelectedTags.value = []
        showTagsPopup.value = false
    }
}

function deleteOutSelectedTags(index) {
    tagsShow.value.push(outSelectedTags.value[index])
    outSelectedTags.value.splice(index, 1)
}

function onSearch() {
    if (search.value === '') {
        tagsShowSearch.value = tagsShow.value
        return
    } else {
        $http.get('getTagsByVal', {
            params: {
                user: localStorage.getItem("user"),
                select: search.value
            }
        }).then(res => {
            tagsShowSearch.value = res.data.tags.map(obj => obj.tag)
            tagsShowSearch.value = tagsShowSearch.value.filter(item => !innerSelectedTags.value.includes(item))
            searchIndexInShow.value = tagsShowSearch.value.map(item => tagsShow.value.indexOf(item))
        })
    }
}

const tagsToDisplay = computed(() => {
    if (tagsShowSearch.value.length > 0) return tagsShowSearch.value
    else {
        search.value = ''
        return tagsShow.value
    }
})

function submit() {
    if (note.value.title === "") {
        showFailToast("你还没有输入标题")
        return
    }
    if (note.value.content === "") {
        showFailToast("内容不能为空")
        return
    }
    if (outSelectedTags.value.length === 0) {
        showFailToast("请至少选择一个标签")
        return
    }
    let submitVal = { ...note.value }
    submitVal.tags = Array.from(outSelectedTags.value).join(',')
    submitVal.user = localStorage.getItem("user")
    submitVal.submit_time = formattedTime
    if (!store.edit) {
        $http.post('addArticle', submitVal).then(res => {
            if (res.data.status !== 0) {
                showFailToast(res.data.message)
            } else {
                showSuccessToast(res.data.message)
                router.push('/home')
                store.editShow = false
            }
        }).catch(err => {
            showFailToast(err)
        })
    } else {
        $http.put('updateArticle', submitVal, { params: { id: store.note.id } }).then(res => {
            if (res.data.status !== 0) {
                showFailToast(res.data.message)
            } else {
                showSuccessToast(res.data.message)
                store.note = {}
                store.edit = false
                store.editShow = false
                router.push('/home')
            }
        }).catch(err => {
            showFailToast(err)
        })
    }
}

function cancelAdd() {
    if (!showTagsPopup.value) return
    showTagsPopup.value = false
    Array.prototype.push.apply(tagsShow.value, innerSelectedTags.value);
}

onMounted(() => {
    if (Object.keys(store.note).length !== 0) {
        note.value.title = store.note.title
        note.value.content = store.note.content
        outSelectedTags.value = store.note.tags.split(',')
    }
})
</script>

<style lang="scss" scoped>
.header {
    font-size: 12px !important;
}

.title {
    font-size: 28px !important;
    line-height: 1.2;

}

.content {
    font-size: 18px !important;
}

.fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: #fff;
}

.deleteIcon {
    margin-left: 10px;
}
</style>