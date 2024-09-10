<template>

    <div class="jump-timer_button">
        <span class="timer-text">检测到时间点 </span>
        <el-button link v-for="(item, index) in match" :key="index"
            @click="jumpToTime(item)">
            {{ item }}
        </el-button>
    </div>
    

</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useUserStore } from '../stores/user';


const props = defineProps({
    text: String
})

const {
    JUMP_VIDEO_TIME
} = toRefs(useUserStore())


let reg: RegExp = /\d+[:：]\d+/g
let match: RegExpMatchArray = props.text?.match(reg)!



// 跳转时间点
const jumpToTime = (time: string) => {
    let min = parseInt(time.split(':')[0] || time.split('：')[0])
    let sec = parseInt(time.split(':')[1] || time.split('：')[1])
    let _time = min * 60 + sec
    JUMP_VIDEO_TIME.value = _time
}

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