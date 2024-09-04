<template>

    <div style="width: 90px;">
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
import { fetchData } from "../../../utils/fetchData";

const props = defineProps({
    aid: Number,
    num: Number
})



// 点赞视频
const like = async () => {
    await fetchData(`/api/video/like?aid=${props.aid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElNotification({message: '点赞成功', type: 'success'})
            liked.value = true
        } else {
            ElNotification({message: data.message, type: 'error'})
        }
    })
}



// 判断视频是否点赞过
const liked = ref(true)
const hasLiked = async () => {
    await fetchData(`/api/video/has/like?aid=${props.aid}`, {
    }, (data: BiliResType)=> {
        if (data.code === 0) {
            if (!data.data) {
                liked.value = false
            }
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    })
}
hasLiked()

</script>

<style scoped>

</style>