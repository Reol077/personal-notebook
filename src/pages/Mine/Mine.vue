<template>
    <div class="box">
        <van-nav-bar title="我的" style="margin-bottom: 30px;" right-text="退出" @click-right="editLogin"></van-nav-bar>
        <van-row justify="center">
            <van-col span="24" style="text-align: center;">
                <van-image @click="uploadAvatarShow = true" height="5rem" round :src="userInfo.user_pic"></van-image>
            </van-col>
        </van-row>
        <van-cell-group inset style="margin-top: 30px;">
            <van-cell is-link title="用户名" @click="showEdit(0)">{{ userInfo.username }}</van-cell>
            <van-cell is-link title="昵称" @click="showEdit(1)">{{ userInfo.nickname }}</van-cell>
            <van-cell is-link title="修改密码" @click="showEdit(2)"></van-cell>
        </van-cell-group>
        <van-cell-group inset style="margin-top: 30px;">
            <van-cell is-link title="注销账号" @click="removeUser"></van-cell>
        </van-cell-group>
        <van-popup v-model:show="editShow" position="right" :style="{ width: '100%', height: '100%' }">
            <van-nav-bar :title="active === 0 ? '编辑用户名' : (active === 1 ? '编辑昵称' : '修改密码')" left-arrow
                @click-left="closeEdit" right-text="保存" @click-right="onSubmit" />
            <div class="editBox">
                <div v-if="active === 0">
                    <van-cell-group inset>
                        <van-cell>
                            <van-field v-model="editUserInfo.username" placeholder="设置一个新的用户名"></van-field>
                        </van-cell>
                    </van-cell-group>
                    <van-row class="tipsText">用户名长度在3~12个字符，只可以是数字或字母</van-row>
                </div>
                <div v-if="active === 1">
                    <van-cell-group inset>
                        <van-cell>
                            <van-field v-model="editUserInfo.nickname" placeholder="设置一个新的昵称"></van-field>
                        </van-cell>
                    </van-cell-group>
                    <van-row class="tipsText">昵称长度不超过12个字符</van-row>
                </div>
                <div v-if="active === 2" class="editPwd">
                    <van-cell-group inset>
                        <van-cell>
                            <van-field v-model="editPassword.oldPassword" type="password" placeholder="旧密码" />
                        </van-cell>
                    </van-cell-group>
                    <van-cell-group inset>
                        <van-cell>
                            <van-field v-model="editPassword.newPassword" type="password" placeholder="新密码" />
                        </van-cell>
                    </van-cell-group>
                    <van-cell-group inset>
                        <van-cell>
                            <van-field v-model="editPassword.reNewPassword" type="password" placeholder="确认密码" />
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
        </van-popup>
        <van-popup class="avatar" v-model:show="uploadAvatarShow" position="bottom">
            <van-row>
                <van-col span="24" @click="previewImage">
                    查看头像
                </van-col>
            </van-row>
            <van-row>
                <van-col span="24">
                    <van-uploader :after-read="uploadAvatar">
                        上传头像
                    </van-uploader>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="24" @click="uploadAvatarShow = false">取消</van-col>
            </van-row>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import defaultAvatar from '../../assets/image/touixang.png'
import { showFailToast, showSuccessToast, showConfirmDialog, showImagePreview } from 'vant/es'
import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'

const { $http } = getCurrentInstance().appContext.config.globalProperties
const router = useRouter()
const avatar = ref(defaultAvatar)

const editUserInfo = ref({})
const userInfo = ref({})
const editShow = ref(false)
const active = ref(0)
const uploadAvatarShow = ref(false)

const editPassword = ref({
    oldPassword: "",
    newPassword: "",
    reNewPassword: ""
})

function showEdit(index) {
    active.value = index
    editShow.value = true
}

function closeEdit() {
    editShow.value = false
}

function onSubmit() {
    if (active.value === 0) {
        const username = { username: editUserInfo.value.username }
        $http.put('updateUsername', username).then(res => {
            if (res.data.status !== 0) {
                getUserInfo()
                return showFailToast(res.data.message)
            }
            else {
                localStorage.setItem("user", editUserInfo.value.username)
                getUserInfo()
                showSuccessToast(res.data.message)
            }
        })
    } else if (active.value === 1) {
        const nickname = { nickname: editUserInfo.value.nickname }
        $http.put('updateNickname', nickname, { params: { id: editUserInfo.value.id } }).then(res => {
            if (res.data.status !== 0) {
                getUserInfo()
                return showFailToast(res.data.message)
            }
            else {
                getUserInfo()
                showSuccessToast(res.data.message)
            }
        })
    } else if (active.value === 2) {
        if (editPassword.value.oldPassword === "") {
            return showFailToast("请先输入原密码")
        } else if (editPassword.value.newPassword === "") {
            return showFailToast("请输入新密码")
        } else if (editPassword.value.reNewPassword === "") {
            return showFailToast("请确认密码")
        } else {
            if (editPassword.value.reNewPassword !== editPassword.value.newPassword) {
                return showFailToast("两次输入的密码不一致")
            } else {
                $http.put('updatePassword', { newPassword: editPassword.value.newPassword, oldPassword: editPassword.value.oldPassword }).then(res => {
                    if (res.data.status !== 0) return showFailToast(res.data.message)
                    else {
                        showSuccessToast(res.data.message)
                        localStorage.clear()
                        router.push('/')
                    }
                })
            }
        }
    }
    editShow.value = false
}

function removeUser() {
    showConfirmDialog({
        title: '确认注销',
    }).then(() => {
        $http.delete('removeUser').then(res => {
            if (res.data.status !== 0) return showFailToast(res.data.message)
            showSuccessToast(res.data.message)
            router.push('/')
            location.reload();
            localStorage.clear()

        }).catch(err => {
            showFailToast(err)
        })
    })
}

function getUserInfo() {
    const user = localStorage.getItem("user")
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
            // if (userInfo.value.user_pic !== null) {
            //     userInfo.value.user_pic = dataURI
            // } else {
            //     userInfo.value.user_pic = avatar
            // }

            editUserInfo.value = { ...userInfo.value }
        }
    })
}

function editLogin() {
    showConfirmDialog({ title: "确认退出" }).then(() => {
        localStorage.clear()
        router.push('/')
    })
}

function previewImage() {
    showImagePreview([userInfo.value.user_pic]);
}

function uploadAvatar(file) {
    return new Promise((resolve, reject) => {
        const form = new FormData()
        form.append('pic', file.file)
        form.append('user', localStorage.getItem("user"))
        $http.post('/updateAvatar', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log("ok", res);
        }).catch(err => {
            console.log(err);
        })
    })
    /* TODO 数据库保存BLOB
    console.log(file);
    console.log(file.file);
    $http.post('updateAvatar', { user_pic: file.file })
        .then(res => {
            if (res.data.status !== 0) return showFailToast("上传失败")
            console.log(res.data.message);
        }).catch(err => {
            console.log(err);
        })
    */
}


onMounted(() => {
    getUserInfo()
})
</script>

<style lang="scss" >
.van-cell {
    font-size: 18px;
}

.editBox {
    height: calc(100vh - 78px);
    padding-top: 30px;

    .van-cell {
        .van-field {
            padding-top: 0;
            padding-bottom: 0;
        }
    }

    .tipsText {
        padding: 16px 48px;
        color: gray;
    }

    .editPwd {
        .van-cell-group {
            margin-top: 20px;
        }
    }
}

.avatar {
    border-radius: 25px 25px 0 0;

    .van-row {
        height: 48px;
        line-height: 48px;

        .van-col {
            text-align: center;
            font-size: 20px;
        }
    }

    .van-row:nth-child(3) {
        background: var(--backgroung-color-gray) !important;
        padding-top: 10px;

        .van-col {
            background: white;
        }
    }
}
</style>

