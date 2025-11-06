<template>
    
    <el-divider content-position="left">
        <h3>最近投币的视频</h3>
    </el-divider>

    <div v-if="coinVideoList" class="video-list">
        <div v-for="(item, index) in coinVideoList" :key="index" 
            class="video-item">
            <el-image :src="item.pic" fit="cover" lazy class="video-bg"/>
            <RouterLink :to="`/video/${item.bvid}`">
                <div class="video-info">
                    <div class="video-title">{{ item.title }}</div>
                    <div class="video-stat">
                        <span><i>&#xe736;</i>{{ item.owner.name }}</span>
                        <span><i>&#xe81a;</i>{{ item.stat.view }}</span>
                        <span><i>&#xe6ee;</i>{{ item.stat.danmaku }}</span>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>

    <el-empty v-else description="该用户隐藏了最近投币视频" />

</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import { fetchData } from '../../../utils/fetchData';

const route = useRoute()

const coinVideoList: Ref<any> = ref(null)

// 获取投币视频
const getCoinVideoList = async (mid: any) => {
    await fetchData(`/api/space/video/coin?mid=${mid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            coinVideoList.value = data.data
            // console.log('coinVideoList', coinVideoList.value)
        } else {
            ElNotification.warning(data.message)
        }
    })
}



watch(() => route.params.mid, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        await getCoinVideoList(newVal)
    }
}, {
    immediate: true
})

</script>

<style scoped>
</style>