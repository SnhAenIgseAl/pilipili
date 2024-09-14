<template>

    <div v-if="hasJumpTime" class="jump-timer_button">
        <span class="timer-text">检测到时间点 </span>
        <el-button link v-for="(item, index) in match" :key="index"
            @click="jumpToTime(item)">
            {{ item }}
        </el-button>
    </div>
    

</template>

<script setup lang="ts">
import { ref, Ref, toRefs, onMounted } from 'vue';
import { useUserStore } from '../stores/user';


const props = defineProps({
    text: String
})

const {
    JUMP_VIDEO_TIME
} = toRefs(useUserStore())


const reg: RegExp = /\d+[:：]\d+/g
const match: RegExpMatchArray = props.text?.match(reg)!
const hasJumpTime: Ref<boolean> = ref(match && match.length > 0)



// 跳转时间点
const jumpToTime = (time: string) => {
    let min = parseInt(time.split(':')[0] || time.split('：')[0])
    let sec = parseInt(time.split(':')[1] || time.split('：')[1])
    let _time = min * 60 + sec
    JUMP_VIDEO_TIME.value = _time
}

onMounted(() => {
    console.log(match, hasJumpTime.value)
})

</script>

<style scoped>

.jump-timer_button {
    margin-bottom: 4px;
}

.timer-text {
    color: #666;
    font-size: 12px;
    border-left: 2px solid #ddd;
    padding-left: 8px;
}

</style>