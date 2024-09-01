<template>
    <div class="video-play" id="video-play">
        
        <!-- 弹幕 -->
        <vue-danmaku ref="danmakuRef" 
            v-model:danmus="danmus" 
            loop
            class="danmaku-box"
            @click="videoClick">
        </vue-danmaku>

        <!-- 视频 -->
        <longzeVideoPlay
            v-bind="options" 
            ref="videoRef"
            @play="onPlay"
            @pause="onPause"
            @timeupdate="onTimeupdate"
            @ratechange="rateChange"
            @volumechange="volumeChange"/>
        
        <!-- 音频 -->
        <audio v-if="audioUrl" crossorigin="anonymous" ref="audioRef">
            <source :src="audioUrl" />
        </audio>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, Reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchData } from '../../../utils/fetchData';
import type BiliResType from '../../../type/BiliResType';
import type danmakuType from '../../../type/danmakuType'
import { ElMessage } from 'element-plus';
import vueDanmaku from 'vue3-danmaku'
import { filterDanmaku } from '../../../utils/filterDanmaku'

const props = defineProps({
    playerInfo: Object,
    videoInfo: Object
})



/**
 * 由于服务端部署在香港节点，所以哔哩哔哩服务端会返回香港节点的视频流
 * 需要把视频流换成大陆本地的
 */
const videoUrl = ref(null)
const audioUrl = ref(null)
const hk_videoUrl: Ref<string> = ref(props.playerInfo?.dash.video[0].baseUrl.split('/')[2])
const hk_audioUrl: Ref<string> = ref(props.playerInfo?.dash.audio[0].baseUrl.split('/')[2])
let cnUrl: string = 'upos-sz-mirrorcos.bilivideo.com'
videoUrl.value = props.playerInfo?.dash.video[0].baseUrl.replace(hk_videoUrl.value, cnUrl)
audioUrl.value = props.playerInfo?.dash.audio[0].baseUrl.replace(hk_audioUrl.value, cnUrl)



// 查询用户与自己的关系
const attr: Ref<number> = ref(0)
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



// 获取视频弹幕
const danmakuList: Ref<danmakuType[]> = ref([])
const getDanmaku = async () => {
    await fetchData(`/api/video/danmaku?bvid=${props.videoInfo?.bvid}`, {
    }, (data: any) => {

        // 弹幕过滤
        data.data = filterDanmaku(data.data)
        // console.log(data.data)

        danmakuList.value = data.data
    })
}
getDanmaku()



// 播放器配置
let options: Reactive<any> = reactive({
    width: '100%',
    height: '100%',
    color: "#fff",
    title: `${props.videoInfo?.title}`,
    src: `${videoUrl.value}`,
    muted: false,
    webFullScreen: false,
    speedRate: ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"],
    autoPlay: false,
    loop: false,
    mirror: false,
    ligthOff: false,
    volume: 0.5,
    preload: 'auto',
    control: true,
    controlBtns:['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen'] //显示所有按钮,
})



const audioRef: any = ref(null)
const videoRef: any = ref(null)

// 播放
const onPlay = () => {
    videoRef.value.play()
    audioRef.value.play()
    danmakuRef.value.play()
}

// 暂停
const onPause = () => {
    videoRef.value.pause()
    audioRef.value.pause()
    danmakuRef.value.pause()
}


// 视频点击暂停或播放
const videoClick = () => {
    if (audioRef.value.paused) {
        onPlay()
    } else {
        onPause()
    }
}


const danmakuIndex: Ref<number> = ref(0)
const danmakuRef = ref()
const danmus: Ref<[]> = ref([])

// 时间轴
const onTimeupdate = (e: any) => {

    // 音画时间误差大于0.5秒时同步
    if (Math.abs(e.target.currentTime - audioRef.value.currentTime) > 0.5) {
        audioRef.value.currentTime = e.target.currentTime
        danmakuIndex.value = getDanmakuIndex(e.target.currentTime)!
    }

    // 绘制弹幕，轮子，爽
    if (danmakuRef.value) {
        while (e.target.currentTime > danmakuList.value[danmakuIndex.value]?.time) {
            danmakuRef.value.insert(danmakuList.value[danmakuIndex.value]?.content)
            danmakuIndex.value += 1
        }
    }
}

// 获取弹幕列表下标
const getDanmakuIndex = (time: number) => {
    for (let i = 0; i < danmakuList.value.length; i++){
        if (time < danmakuList.value[i].time) {
            return i
        }
    }
    // return 0
}

// 速度控制
const rateChange = (e: any) => {
    audioRef.value.playbackRate  = e.target.playbackRate 
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

.danmaku-box {
    position: absolute;
    display: flex;
    flex-flow: column wrap;
    align-items: start;
    width: 100%;
    height: calc(100% - 40px);
    z-index: 2;
    overflow: hidden;
}


</style>

<style>
.dm {
    font-size: 24px !important;
    line-height: 24px !important;
    color: #eee !important;
    text-shadow: 0px 0px 3px #000 !important;
}

.d-player-state {
    z-index: 1 !important;
}
</style>