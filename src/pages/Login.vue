<template>
    <div class="box">
        <div class="fontBox">
            <h1>Personal</h1>
            <h1>NoteBook</h1>
        </div>
        <van-row justify="center" class="buttonBox">
            <van-col span="11">
                <van-button type="default" @click="showLogin">登录</van-button>
            </van-col>
            <van-col span="2"></van-col>
            <van-col span="11">
                <van-button type="default" @click="showRegister">注册</van-button>
            </van-col>
        </van-row>
        <van-popup v-model:show="loginFlag" position="bottom" :style="{ height: '60%' }">
            <div class="logoBox"><img :src="logo"></div>
            <van-form @submit="onLogin">
                <van-cell-group inset>
                    <van-field center v-model="LoginInfo.username" placeholder="请输入用户名"
                        :rules="[{ validator: validatorUsername }]" />
                    <van-field center v-model="LoginInfo.password" type="password" placeholder="请输入密码"
                        :rules="[{ validator: validatorPassword }]" />
                </van-cell-group>
                <div class="RegBox">
                    <van-button round block type="primary" native-type="submit">
                        登录
                    </van-button>
                </div>
            </van-form>
        </van-popup>
        <van-popup v-model:show="regFlag" position="bottom" :style="{ height: '60%' }">
            <div class="logoBox"><img :src="logo"></div>
            <van-form @submit="onRegister">
                <van-cell-group inset>
                    <van-field center v-model="RegInfo.username" placeholder="请输入用户名"
                        :rules="[{ validator: validatorUsername }]" />
                    <van-field center v-model="RegInfo.password" type="password" placeholder="请输入密码"
                        :rules="[{ validator: validatorPassword }]" />
                    <van-field center v-model="repassword" type="password" placeholder="请再次输入密码"
                        :rules="[{ validator: validatorRePassword }]" />
                </van-cell-group>
                <div class="RegBox">
                    <van-button round block type="primary" native-type="submit">
                        注册
                    </van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>

<script setup>
import logo from '../assets/image/book.png'
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant';


const { $http } = getCurrentInstance().appContext.config.globalProperties

const router = useRouter();

const regFlag = ref(false)
const loginFlag = ref(false)

const RegInfo = ref({
    username: "",
    password: "",
})

const LoginInfo = ref({
    username: "admin123",
    password: "123456",
})

const repassword = ref("")

function validatorUsername(val) {
    if (val === "") {
        return "请输入用户名"
    }
    if (val.length < 3 || val.length > 12) {
        return "用户名长度须在3-12个字符"
    } else {
        const regex = /^[a-zA-Z\d]{3,12}$/
        if (!regex.test(val)) {
            return "用户名需要同时包含数字和字母"
        }
    }
}

function validatorPassword(val) {
    if (val === "") {
        return "请输入密码"
    } else {
        const regex = /^[\S]{6,12}$/
        if (!regex.test(val)) {
            return "密码需要6至12位"
        }
    }
}

function validatorRePassword(val) {
    if (val === "") return "请再次输入密码"
    else if (val !== RegInfo.value.password) return "两次输入的密码不一致"
}

function showLogin() {
    loginFlag.value = true
}

function showRegister() {
    regFlag.value = true
}

function onRegister() {
    $http.post('regUser', RegInfo.value).then(res => {
        if (res.data.status !== 0) {
            showFailToast(res.data.message)
        } else {
            RegInfo.value = {}
            repassword.value = ""
            showSuccessToast(res.data.message)
            regFlag.value = false
        }

    }).catch(error => {
        showFailToast(error)
    })
}

function onLogin() {
    $http.post('login', LoginInfo.value).then(res => {
        if (res.data.status !== 0) {
            showFailToast(res.data.message)
        } else {
            showSuccessToast(res.data.message)
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", LoginInfo.value.username)
            router.push('/home')
        }
    }).catch(error => {
        showFailToast(error)
    })
}


</script>


<style lang="scss" scoped>
.box {
    background-image: url('../assets/image/background.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    height: 100vh;

    .fontBox {
        font-family: "children";
        position: absolute;
        left: 50%;
        top: 15%;
        transform: translate(-50%);
        font-size: 32px;

        h1 {
            text-align: center;
            margin: 20px;
        }
    }

    .buttonBox {
        padding-top: 70vh;

        .van-col {
            text-align: center;
            font-family: "children";

            button {
                font-size: 32px;
                padding: 20px;
                color: black;
                font-weight: bold;
            }

        }
    }

    .logoBox {
        width: 100%;
        text-align: center;
        height: 100px;
        margin-bottom: 10px;

        img {
            height: 100%;
        }
    }

    .van-form {
        .van-field {
            font-size: 18px;
            margin-bottom: 10px;
        }

        .RegBox {
            display: flex;
            justify-content: center;
            margin-top: 20px;

            .van-button {
                width: 60%;
            }
        }
    }
}
</style>

