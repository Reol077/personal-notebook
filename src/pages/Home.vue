<template>
    <div>
        <router-view></router-view>
        <van-tabbar route>
            <van-tabbar-item replace to="/home/input" icon="add-o">笔记</van-tabbar-item>
            <van-tabbar-item replace to="/home/class" icon="award-o">分类</van-tabbar-item>
            <van-tabbar-item replace to="/home/mine" icon="home-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

