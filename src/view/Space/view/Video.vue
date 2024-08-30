<template>
    <el-divider content-position="left">
        <h3>投稿视频</h3>
    </el-divider>

    <div v-if="videoList" class="video-list">
        <div v-for="(item, index) in videoList" :key="index" class="video-item"
            :style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.cover}@600w.webp)` }">

            <RouterLink :to="`/video/${item.bvid}`">
                <div class="video-info">
                    <div class="video-title">{{ item.title }}</div>
                    <div class="video-stat">
                        <span><i>&#xe81a;</i>{{ item.play }}</span>
                        <span><i>&#xe6ee;</i>{{ item.danmaku }}</span>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>

    <div class="page">
        <el-pagination layout="prev, pager, next" 
            :total="50"
            background
            @current-change="changePage"/>
    </div>


</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, Ref } from 'vue'
import { fetchData } from '../../../utils/fetchData'
import BiliResType from '../../../type/BiliResType';
import { useRoute } from 'vue-router';


const route = useRoute()


const videoList: Ref<any[]> = ref([])
const getVideoList = async () => {
    await fetchData(`/api/space/video?mid=${route.params.mid}`, {
    }, (data: BiliResType) => {
        console.log(data)
        if (data.code === 0) {
            videoList.value = data.data.item
        } else {
            ElMessage.error(data.message)
        }
    })
}
getVideoList()



const changePage = (page: number) => {
    console.log(page)
}


</script>

<style scoped>
.page {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
</style>