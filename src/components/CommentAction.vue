<template>

    <!-- 点赞 -->
    <el-button text size="small" @click="action(1)">
        <el-text type="info"><i>&#xe644;</i>{{ props.like }}</el-text>
    </el-button>

    <!-- 点踩 -->
    <el-button text size="small" @click="action(0)">
        <el-text type="info"><i>&#xe847;</i></el-text>
    </el-button>

</template>

<script setup lang="ts">
// import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import type BiliResType from '../type/BiliResType';

const props = defineProps({
    type: Number,   // 评论区类型
    oid: String,    // 评论区id
    rpid: Number,   // 当前评论id
    like: Number    // 点赞数
})


// const likeNum: any = ref(props.like)


// 点赞 | 点踩评论或动态
const action = async (action: Number) => {
    console.log(props.type, props.oid, props.rpid)

    try {
        let res = await fetch(`/api/reply/action`, {
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
        })
        let data: BiliResType = await res.json()

        if (data.code === 0 && action === 1) {
            ElMessage({ message: '点赞成功', type: 'success' })
            // likeNum.value ++
        } else if (data.code === 0 && action === 0) {
            ElMessage({ message: '点踩成功', type: 'success' })
            // likeNum.value --
        } else {
            console.log(data.message)
            ElMessage({ message: data.message, type: 'error' })
        }
    } catch (err) {
        ElMessage({ message: '网络未连接', type: 'error' })
    }
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