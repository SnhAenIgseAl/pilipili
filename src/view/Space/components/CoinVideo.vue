<template>
    
    <el-divider content-position="left">
        <h3>最近投币的视频</h3>
    </el-divider>

    <div v-if="coinVideoList" class="video-list">
        <div v-for="(item, index) in coinVideoList" :key="index" 
            class="video-item"
            :style="{backgroundImage: `url(https://images.weserv.nl/?url=${item.pic}@600w.webp)`}">
            
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
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import BiliResType from '../../../type/BiliResType';

const route = useRoute()

const coinVideoList: any = ref(null)

const getCoinVideoList = async (mid: any) => {
    try {
        let res = await fetch(`/api/space/video/coin?mid=${mid}`)
        let data: BiliResType = await res.json()

        if (data.code === 0) {
            // 真的捏妈的牛皮，返回13个，去掉最后一个
            coinVideoList.value = data.data
            coinVideoList.value.length = 12
            console.log('coinVideoList', coinVideoList.value)
        } else {
            ElNotification({message: data.message, type: 'error'})
        }
    } catch (err) {
        ElNotification({message: '服务器连接失败', type: 'error'})
    }
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