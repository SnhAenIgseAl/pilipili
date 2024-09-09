<template>

    <div>
        <el-text>检测到时间点 </el-text>
        <el-button link @click="jumpToTime(time)">
            {{ match.input }}
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


let reg: RegExp = /^\d+：\d+$/
let match: RegExpExecArray = reg.exec(props.text!)!
// console.log(match)
let min = parseInt(match.input.split('：')[0])
let sec = parseInt(match.input.split('：')[1])
let time = min * 60 + sec

const jumpToTime = (time: number) => {
    JUMP_VIDEO_TIME.value = time
    console.log(JUMP_VIDEO_TIME.value)
}

</script>

<style scoped>

</style>