<template>

    <el-button text size="large" @click="relatedVisible = true"><i>&#xe67c;</i>视频推荐</el-button>

    <el-drawer v-model="relatedVisible" 
        title="相关推荐" 
        size="300" 
        direction="ltr"
        @opened="getRelatedList">

        <el-scrollbar>

            <div v-for="(item, index) in relatedList" :key="index">
            <RouterLink :to="`/video/${item.bvid}`"><div class="related-item" :style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.pic}@600w.webp)`}">

                <div class="related-info">
                    <div class="related-title">
                        {{ item.title }}
                    </div>
                    <span><i>&#xe81a;</i>{{ item.stat.view }}</span>
                    <span><i>&#xe81a;</i>{{ item.stat.danmaku }}</span>
                    <span><i>&#xe644;</i>{{ item.stat.like }}</span>
                </div>
            </div></RouterLink></div>

        </el-scrollbar>

    </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type BiliResType from '../../../type/BiliResType'

const props = defineProps({
    bvid: String
})



const relatedVisible = ref(false)

const relatedList: any = ref(null)

// 获取视频相关推荐
const getRelatedList = async () => {
    try {
        let res = await fetch(`/api/video/related?bvid=${props.bvid}`)
        let data: BiliResType = await res.json()

        console.log(data)

        if (data.code === 0) {
            relatedList.value = data.data
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    } catch (err) {
        ElMessage({message: '网络未连接', type: 'error'})
    }
}

</script>

<style scoped>

.related-item {
    position: relative;
    width: auto;
    height: 180px;
    margin: 16px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

.related-info {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 12px;
    font-size: 14px;
    color: var(--cl-white-75);
    background: linear-gradient(to top, var(--cl-black), var(--cl-lucency));

    span {
        margin-right: 12px;
    }
}

.related-title {
    font-size: 16px;
    color: var(--cl-white);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 10px;
}
</style>