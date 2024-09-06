<template>
    <el-button text size="small" @click="showInput">
        <el-text type="info"><i>&#xe667;</i>回复</el-text>
    </el-button>

    <div v-if="inputVisible" class="reply-box">
        <el-input v-model="replyTxt" :placeholder="dftTxt" resize="none" type="textarea" />
        
        <div class="reply-control">
            <div>
                <el-button text size="small"><i>&#xe64a;</i></el-button>
                <Mention type="comment" />
            </div>
            <div>
                <el-button text @click="resetReply">清空</el-button>
                <el-button type="primary" 
                    :loading="addCommentLoading"
                    @click="addComment">
                    发布
                </el-button>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchData } from '../utils/fetchData';
import type BiliResType from '../type/BiliResType';
import Mention from './Mention.vue';

const props = defineProps({
    type: Number,   // 评论区类型
    oid: String,    // 评论区id
    rpid: Number,   // 当前评论id
    num: Number     // 评论数
})



const inputVisible = ref(false)

// 点击回复按钮显示评论框
const showInput = () => {
    inputVisible.value = !inputVisible.value
}



const replyTxt: Ref<null> = ref(null)
const dftTxt: Ref<string> = ref('少点道理，多点攻击')
const addCommentLoading: Ref<boolean> = ref(false)

// 清空评论内容
const resetReply = () => {
    replyTxt.value = null
}



// 发表评论
const addComment = async () => {
    addCommentLoading.value = true

    await fetchData(`/api/reply/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: props.type,
            oid: props.oid,
            rpid: props.rpid
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success({ message: '发表评论成功' })
            addCommentLoading.value = false
        } else {
            ElMessage.error({ message: data.message })
            addCommentLoading.value = false
        }
    })
}

</script>

<style scoped>

.reply-box {
    width: 420px;
    margin-top: 16px;

    .reply-control {
        display: flex;
        justify-content: space-between;
        align-items: top;
        margin-top: 8px;
    }
}
</style>