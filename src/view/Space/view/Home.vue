<template>

    <!-- 代表作 -->
    <TopAndMaster />

    <!-- 投稿视频 -->
    <VideoList :videoList="videoList" />

    <!-- 最近点赞的视频 -->
    <LikeVideo />

    <!-- 最近投币的视频 -->
    <CoinVideo />

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchData } from '../../../utils/fetchData';
import type BiliResType from '../../../type/BiliResType';
import { ElMessage } from 'element-plus';
import TopAndMaster from '../components/TopAndMaster.vue'
import LikeVideo from '../components/LikeVideo.vue'
import CoinVideo from '../components/CoinVideo.vue'
import { useRoute } from 'vue-router';
import VideoList from '../components/VideoList.vue';

const route = useRoute()

const videoList: any = ref(null)
const getVideoList = async () => {
    await fetchData(`/api/space/video?mid=${route.params.mid}`, undefined, (data: BiliResType) => {
        console.log(data)
        if (data.code === 0) {
            videoList.value = data.data.item
        } else {
            ElMessage.error(data.message)
        }
    })
}
getVideoList()

</script>

<style scoped>

</style>