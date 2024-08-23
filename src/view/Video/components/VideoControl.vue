<template>
    <div v-if="props.playerInfo" class="video-play" id="video-play">

        <vue3VideoPlay v-bind="options" 
            :poster='props.videoInfo?.pic'
            @play="onPlay"
            @pause="onPause"
            @timeupdate="onTimeupdate"
            @volumechange="volumeChange"/>
        
        <audio crossorigin="anonymous" ref="audioRef">
            <source :src="props.playerInfo?.dash.audio[0].baseUrl" />
        </audio>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { fetchData } from '../../../utils/fetchData';
import type BiliResType from '../../../type/BiliResType';
import { ElMessage } from 'element-plus';


const props = defineProps({
    playerInfo: Object,
    videoInfo: Object
})



// 查询用户与自己的关系
const attr = ref(0)
const getRelation = async (mid: Number) => {
    await fetchData(`/api/relation?mid=${mid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            attr.value = data.data.relation.attribute
            console.log(attr.value)
        } else {
            ElMessage.error({ message: data.message })
        }
    })
}
getRelation(props.videoInfo?.owner.mid)


const options = reactive({
    width: '100%',
    height: '100%',
    color: "var(--cl-primary)",
    title: `${props.videoInfo?.title}`,
    src: `${props.playerInfo?.dash.video[0].baseUrl}`,
    // muted: false,
    webFullScreen: false,
    speedRate: ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"],
    autoPlay: true,
    loop: false,
    mirror: false,
    ligthOff: false,
    volume: 0.5,
    preload: 'auto',
    control: true,
    controlBtns:['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen'] //显示所有按钮,
})



const audioRef: any = ref(null)

// 播放
const onPlay = () => {
    audioRef.value.play()
}

// 暂停
const onPause = () => {
    audioRef.value.pause()
}

// 时间轴
const onTimeupdate = (e: any) => {
    audioRef.value.currentTime = e.target.currentTime
}

// 音量控制
const volumeChange = (e: any) => {
    audioRef.value.volume = e.target.volume
}


</script>

<style scoped>

.video-play {
    position: relative;
    flex: 1;
    /* width: calc(100%); */
    min-width: 1280px;
    height: calc(100% - 60px);
    margin: 0 auto;
    background: #000;

    &:hover {
        .video-info {
            opacity: 1;
        }
    }

    video {
        width: 100%;
        height: 100%;
    }
}
</style>