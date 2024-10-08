<template>

    <!-- 已点赞 -->
    <el-button v-if="liked" text 
        @click="like" 
        style="color: var(--cl-primary);">
        <i>&#xe6e3;</i>{{ likeNum }}
    </el-button>

    <!-- 未点赞 -->
    <el-button v-else text 
        @click="like">
        <i>&#xe644;</i>{{ likeNum }}
    </el-button>

</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import { fetchData } from '../../../utils/fetchData';

const props = defineProps({
    dyId: String,
    like: Object
})

let likeNum: Ref<number> = computed(() => props.like!.count)
const liked: Ref<boolean> = ref(props.like!.status)

// 点赞|取消点赞动态
const like = async () => {

    let action = liked.value ? 0 : 1

    await fetchData(`/api/dynamic/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dyn_id_str: props.dyId,
            up: action
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            if (action === 1) {
                ElMessage.success('点赞成功')
                likeNum = computed(() => props.like!.count + 1)
            } else {
                ElMessage.success('取消点赞成功')
                likeNum = computed(() => props.like!.count)
            }
            liked.value = !liked.value
        } else {
            ElMessage.error(data.message)
        }
    })
}

</script>

<style scoped>

</style>