<template>
    <div class="video-play" id="video-play">
        
        <!-- 弹幕 -->
        <vue-danmaku ref="danmakuRef" 
            v-model:danmus="danmus" 
            :isSuspend="true"
            useSlot
            loop
            class="danmaku-box"
            @click="videoClick">

            <template v-slot:dm="{ danmu }" class="danmaku">
                <el-popover
                    placement="bottom"
                    :offset="4"
                    :width="60"
                    trigger="hover"
                    effect="dark">

                    <template #reference>
                        <span class="danmaku-item" 
                            @mouseover="showUserId(danmu)">
                            {{ danmu.content }}
                        </span>
                    </template>

                    <template #default>
                        <span @click="goToSpace(danmu.mid)">
                            {{ danmu.mid }}
                        </span>    
                    </template>

                </el-popover>
            </template>

        </vue-danmaku>

        <!-- 视频 -->
        <longzeVideoPlay
            v-bind="options" 
            ref="videoRef"
            id="videoPlayer"
            @play="onPlay"
            @pause="onPause"
            @timeupdate="onTimeupdate"
            @ratechange="rateChange"
            @volumechange="volumeChange">
        </longzeVideoPlay>

        <!-- 发送弹幕 -->
        <el-input v-model="bulletInput" 
            size="small"
            class="bullet-input"
            @focus="videoPause"
            @blur="videoPlay">

            <!-- 弹幕样式设置 -->
            <template #prepend>
                <el-popover :visible="bulletStyleVisible" :width="200">

                    <template #reference>
                        <el-button @click="bulletStyleVisible = !bulletStyleVisible">A</el-button>
                    </template>

                    <template #default>
                        <el-text>弹幕颜色</el-text>
                        <el-color-picker v-model="bulletColor" :predefine="predefineColors" /><br />
                        <el-text>弹幕字号</el-text>
                        <el-select v-model="bulletFontSize"
                            placeholder="">
                            <el-option
                                v-for="item in bulletFontSizeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"/>
                        </el-select>
                        <el-text>弹幕位置</el-text>
                        <el-select v-model="bulletMode"
                            placeholder="">
                            <el-option
                                v-for="item in bulletModeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"/>
                        </el-select>
                    </template>

                </el-popover>
            </template>

            <template #append>
                <el-button @click="sendBullet" type="primary">发送</el-button>
            </template>

        </el-input>

        <!-- 音频 -->
        <audio v-if="audioUrl" crossorigin="anonymous" ref="audioRef">
            <source :src="audioUrl" />
        </audio>

    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, Reactive } from 'vue';
import type { Ref } from 'vue';
import { fetchData } from '../../../utils/fetchData';
import type BiliResType from '../../../type/BiliResType';
import type danmakuType from '../../../type/danmakuType'
import { ElMessage, ElNotification } from 'element-plus';
import vueDanmaku from 'vue3-danmaku'
import { filterDanmaku } from '../../../utils/filterDanmaku'
import BiliMidCrc from '../../../utils/BiliMidCrc'
import { useUserStore } from '../../../stores/user';
// import Bullet from './Bullet.vue';

const props = defineProps({
    playerInfo: Object,
    videoInfo: Object
})

const {
    JUMP_VIDEO_TIME
} = toRefs(useUserStore())


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
            ElMessage.error(data.message)
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
    audioRef.value.volume = 0.5
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
const danmus: Ref<danmakuType[]> = ref([])

// 时间轴
const onTimeupdate = (e: any) => {

    // 时间点跳转
    if (JUMP_VIDEO_TIME.value) {
        e.target.currentTime = JUMP_VIDEO_TIME.value
        audioRef.value.currentTime = JUMP_VIDEO_TIME.value
        danmakuIndex.value = getDanmakuIndex(JUMP_VIDEO_TIME.value)!
        JUMP_VIDEO_TIME.value = 0
    }

    let currentTime = e.target.currentTime

    // 音画时间误差大于0.5秒时同步
    if (Math.abs(currentTime - audioRef.value.currentTime) > 0.5) {
        audioRef.value.currentTime = currentTime
        danmakuIndex.value = getDanmakuIndex(currentTime)!     // 获取弹幕列表下标
    }

    // 绘制弹幕，轮子，爽
    if (danmakuRef.value) {
        while (e.target.currentTime > danmakuList.value[danmakuIndex.value]?.time) {
            danmakuRef.value.insert(danmakuList.value[danmakuIndex.value])
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

// 弹幕悬浮进入弹幕时，显示弹幕发送者id
const showUserId = (danmu: danmakuType) => {
    const biliMidCrc = BiliMidCrc()
    danmu.mid = biliMidCrc(danmu.hash)
}

// 家访
const goToSpace = (mid: string) => {
    window.open(`/space/${mid}/home`)
}



// 鼠标点击弹幕输入框时暂停视频
const bulletProgress: Ref<number> = ref(0)
const videoPause = () => {
    if (videoRef.value) {
        if (!videoRef.value.paused) {
            onPause()
            // 记录要发送弹幕的出现时间（毫秒）
            bulletProgress.value = audioRef.value.currentTime * 1000    
        }
        console.log(videoRef.value)
    }
}

const videoPlay = () => {
    if (videoRef.value) {
        if (videoRef.value.paused) {
            onPlay()
        }
    }
}


const bulletStyleVisible: Ref<boolean> = ref(false)
const bulletInput: Ref<string> = ref('')
const bulletColor: Ref<string> = ref('#ffffff')
const predefineColors: Ref<string[]> = ref([
    '#ffffff',
    '#fb7299',
    '#f00000',
    '#FEC107',
    '#8BC24B',
    '#2095F4',
    '#9B27B0',
    '#141414'
])
const bulletFontSize: Ref<number> = ref(25)
const bulletFontSizeOptions = [{
    value: 18,
    label: '小'
}, {
    value: 25,
    label: '标准'
}, {
    value: 36,
    label: '大'
}]
const bulletMode: Ref<number> = ref(1)
const bulletModeOptions = [{
    value: 1,
    label: '普通弹幕'
}, {
    value: 4,
    label: '底部弹幕'
}, {
    value: 5,
    label: '顶部弹幕'
}]


// 发送弹幕
const sendBullet = async () => {
    await fetchData(`/api/bullet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bvid: props.videoInfo?.bvid,
            cid: props.videoInfo?.cid,
            fontSize: bulletFontSize.value,
            color: bulletColor.value,
            mode: bulletMode.value,
            msg: bulletInput.value,
            progress: bulletProgress.value
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            bulletInput.value = ''
            ElNotification.success('发送成功')
        } else {
            ElNotification.error(data.message)
        }
    })
}


</script>

<style scoped>

.video-play {
    position: relative;
    flex: 1;
    width: calc(100%);
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

.danmaku-item {
    &:hover {
        cursor: pointer;
        border: 1px solid var(--cl-white);
    }
}

.bullet-input {
    position: absolute;
    z-index: 2;
    /* left: 180px; */
    /* bottom: 4px; */
    width: 300px;
    margin-left: 32px;
    bottom: -46px;
    left: 660px;
}


</style>

<style>
.dm {
    height: 24px !important;
    font-size: 24px !important;
    line-height: 24px !important;
    text-shadow: 0px 0px 3px #000 !important;
}

.d-player-state {
    z-index: 1 !important;
}
</style>