<template>
    <div>
        <van-nav-bar title="录入" left-arrow right-text="发布" @click-left="backHome" @click-right="submit"></van-nav-bar>
        <van-form>
            <van-cell-group inset>
                <van-field :placeholder="showHeader" readonly class="header"></van-field>
                <van-field v-model="note.title" placeholder="请输入标题" autocomplete="off" class="title"></van-field>
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
        <van-popup v-model:show="showTagsPopup" position="bottom" :style="{ height: '40%' }">
            <van-nav-bar title="选择标签" left-arrow @click-left="showTagsPopup = false" right-text="添加"
                @click-right="addOutSelectedTags"></van-nav-bar>
            <van-grid :column-num="3" :gutter="10" style="margin-top: 10px;">
                <van-grid-item v-for="(val, index) in innerSelectedTags"><span>{{ val }}<van-icon name="cross"
                            class="deleteIcon" @click="deleteInnerSelectedTags(index)" /></span></van-grid-item>
            </van-grid>
            <van-search v-model="search" placeholder="请输入搜索内容" />
            <van-grid :column-num="3" :gutter="10">
                <van-grid-item v-for="(val, index) in tagsShow" @click="addInnerSelectedTags(index)">{{ val
                }}</van-grid-item>
            </van-grid>
        </van-popup>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance, watch, computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant/es';
import { isHidden } from 'vant/lib/utils';


const router = useRouter();
const { $http } = getCurrentInstance().appContext.config.globalProperties

const note = ref({
    title: "",
    content: "",
})

const tags = ref([])
const tagsShow = ref([])

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
    router.push('/home')
}

function showTags() {
    showTagsPopup.value = true
    innerSelectedTags.value = outSelectedTags.value
    if (tags.value.length === 0) {
        $http.get('getTags').then(res => {
            tags.value = res.data.tags.map(obj => obj.tag)
            tagsShow.value = tags.value
        }).catch(err => {
            showFailToast(err)
        })
    }
}

function addInnerSelectedTags(index) {
    innerSelectedTags.value.push(tags.value[index])
    tagsShow.value.splice(index, 1)

}

function deleteInnerSelectedTags(index) {
    tagsShow.value.push(innerSelectedTags.value[index])
    innerSelectedTags.value.splice(index, 1)
}

function addOutSelectedTags() {
    if (innerSelectedTags.value.length > 3) {
        showFailToast("最多只能添加三个标签")
        return
    }
    outSelectedTags.value = innerSelectedTags.value
    innerSelectedTags.value = []
    showTagsPopup.value = false
}

function deleteOutSelectedTags(index) {
    tagsShow.value.push(outSelectedTags.value[index])
    outSelectedTags.value.splice(index, 1)
}

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
    $http.post('addArticle', submitVal).then(res => {
        if (res.data.status !== 0) {
            showFailToast(res.data.message)
        } else {
            showSuccessToast(res.data.message)
            router.push('/home')
        }
    }).catch(err => {
        showFailToast(err)
    })
}

watch(search, (newVal, oldVal) => {
    if (newVal !== "") {
        $http.get('getNoteByVal', { params: { select: search.value } }).then(res => {
            tagsShow.value = res.data.tags.map(obj => obj.tag)
        })
    } else {
        tagsShow.value = tags.value
    }
})
</script>

<style lang="scss" scoped>
.header {
    font-size: 12px !important;
}

.title {
    font-size: 28px !important;
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