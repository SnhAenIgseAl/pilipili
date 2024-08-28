<template>

    <el-button v-if="!liked" text 
        size="small" 
        @click="action(1)">
        <i>&#xe644;</i>{{ likeNum }}
    </el-button>
    <el-button v-else text 
        size="small" 
        style="color: var(--cl-primary);" 
        @click="action(0)">
        <i>&#xe6e3;</i>{{ likeNum }}
    </el-button>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ElMessage } from 'element-plus'
import type BiliResType from '../type/BiliResType';
import { fetchData } from '../utils/fetchData';

const props = defineProps({
    type: Number,   // 评论区类型
    oid: String,    // 评论区id
    rpid: Number,   // 当前评论id
    like: Number,   // 点赞数
    liked: Number   // 是否点赞
})


const likeNum: Ref<number> = ref(props.like!)
const liked: Ref<number> = ref(props.liked!)    // 1为点赞过，0为未点赞


    
/**
 * 点赞 | 取消点赞评论
 * 实测点踩评论没有任何作用纯哄人用的，故舍弃
 * 
 * @param action 1为点赞，0为取消点赞
 */
const action = async (action: Number) => {
    console.log(props.type, props.oid, props.rpid)

    await fetchData(`/api/reply/action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: props.type,
            oid: props.oid,
            rpid: props.rpid || null,
            action: action
        })
    }, (data: BiliResType) => {
        if (data.code === 0 && action === 1) {
            ElMessage({ message: '点赞成功', type: 'success' })
            likeNum.value++
            liked.value = 1
        } else if (data.code === 0 && action === 0) {
            ElMessage({ message: '点踩成功', type: 'success' })
            likeNum.value--
            liked.value = 0
        } else {
            console.log(data.message)
            ElMessage({ message: data.message, type: 'error' })
        }
    })
}


</script>

<style scoped>
.comment-control {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    span {
        margin-right: 16px;
    }
}
</style>