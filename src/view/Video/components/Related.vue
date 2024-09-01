<template>

    <el-button text size="large" @click="relatedVisible = true"><i>&#xe67c;</i>视频推荐</el-button>

    <el-drawer v-model="relatedVisible" 
        title="相关推荐" 
        size="300" 
        direction="ltr"
        @opened="getRelatedList">

        <el-scrollbar>

            <div v-for="(item, index) in relatedList" :key="index">
                <div class="related-item" 
                    :style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.pic}@300w.webp)`}"
                    @click="goToVideo(item.bvid)">
                    <div class="related-info">
                        <div class="related-title">
                            {{ item.title }}
                        </div>
                        <span><i>&#xe81a;</i>{{ item.stat.view }}</span>
                        <span><i>&#xe81a;</i>{{ item.stat.danmaku }}</span>
                        <span><i>&#xe644;</i>{{ item.stat.like }}</span>
                    </div>
                </div>
            </div>

        </el-scrollbar>

    </el-drawer>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import type BiliResType from '../../../type/BiliResType'
import { fetchData } from '../../../utils/fetchData';

const props = defineProps({
    bvid: String
})



const relatedVisible: Ref<boolean> = ref(false)
const relatedList: Ref<any[]> = ref([])



// 获取视频相关推荐
const getRelatedList = async () => {
    await fetchData(`/api/video/related?bvid=${props.bvid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            relatedList.value = data.data
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    })  
}



// 视频跳转
const goToVideo = (bvid: string) => {
    window.location.href = `/video/${bvid}`
    // window.location.reload()
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

    &:hover {
        cursor: pointer;
    }
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