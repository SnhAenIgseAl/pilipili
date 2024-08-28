<template>

    <div class="comment-check">
        <el-button v-if="!checked" text @click="check">
            检查评论状态
        </el-button>

        <el-text v-if="commentStat" type="success">{{ commentStatTxt }}</el-text>
        <el-text v-else type="danger">{{ commentStatTxt }}</el-text>
    </div>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import BiliResType from '../type/BiliResType';
import { fetchData } from '../utils/fetchData';


const props = defineProps({
    type: Number,       // 评论区类型
    oid: String,        // 评论区id
    root: String        // 目标评论id
})


const commentStatTxt: Ref<string> = ref('')
const commentStat: Ref<number> = ref(0)
const checked: Ref<boolean> = ref(false)



// 检查评论状态
const check = async() => {
    await fetchData(`/api/checkComment?type=${props.type}&oid=${props.oid}&root=${props.root}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            commentStatTxt.value = '正常'
            commentStat.value = 1
            checked.value = true
        } else {
            commentStatTxt.value = data.message
            checked.value = true
        }
    })
}

</script>

<style scoped>

.comment-check {
    position: absolute;
    right: 16px;
}

</style>