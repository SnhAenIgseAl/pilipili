<template>

    <div style="width: 120px;">
        <el-button v-if="liked" text size="large" 
            @click="like"
            style="color: var(--cl-primary)">
            <i>&#xe644;</i>{{ props.num }}
        </el-button>

        <el-button v-else text size="large" 
            @click="like">
            <i>&#xe644;</i>{{ props.num }}
        </el-button>
    </div>
    

</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElNotification, ElMessage } from "element-plus";
import type BiliResType from '../../../type/BiliResType'

const props = defineProps({
    aid: Number,
    num: Number
})



// 点赞视频
const like = async () => {
    try {
        let res = await fetch(`/api/video/like?aid=${props.aid}`)
        let data: BiliResType = await res.json()

        if (data.code === 0) {
            ElNotification({message: '点赞成功', type: 'success'})
            liked.value = true
        } else {
            ElNotification({message: data.message, type: 'error'})
        }
    } catch (err) {
        ElNotification({message: '服务器连接失败', type: 'error'})
    }
}



// 判断视频是否点赞过
const liked = ref(true)
const hasLiked = async () => {
    try {
        let res = await fetch(`/api/video/has/like?aid=${props.aid}`)
        let data: BiliResType = await res.json()

        if (data.code === 0) {
            if (!data.data) {
                liked.value = false
            }
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    } catch (err) {
        ElMessage({message: '服务器连接失败', type: 'error'})
    }
}
hasLiked()

</script>

<style scoped>

</style>