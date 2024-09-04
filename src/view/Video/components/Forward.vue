<template>

    <div style="width: 90px;">

        <el-popover placement="top"
            :width="90"
            trigger="click">

            <template #reference>
                <el-button text size="large">
                    <i>&#xe6eb;</i>{{ shareCount }}
                </el-button>
            </template>

            <template #default>
                <el-button class="forward-item" text @click="downloadVideo">
                    <i>&#xe703;</i>下载视频
                </el-button>
                <el-button class="forward-item" text @click="downloadAudio">
                    <i>&#xe703;</i>下载音频
                </el-button>
                <el-button class="forward-item" text @click="copyLink">
                    <i>&#xe6bf;</i>复制视频链接
                </el-button>
                <Forward :dynId="dynId" txt="分享到动态" />
                <el-button class="forward-item" text @click="drawer = true">
                    <i>&#xe69b;</i>生成海报
                </el-button>
            </template>

        </el-popover>
    </div>

	<el-dialog v-model="drawer" 
        title="视频海报" 
        width="632"
		@opened="shareVideoImg">

        <canvas ref="shareRef" class="share-video"></canvas>
		
	</el-dialog >

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import Forward from '../../../components/Card/components/Forward.vue';

const props = defineProps({
    videoInfo: Object,
    playerInfo: Object,
    num: Number
})

const shareCount = ref(props.num)
const dynId: Ref<string> = ref(props.videoInfo?.aid.toString())



// 下载视频
const downloadVideo = () => {
    window.open(`${props.playerInfo?.dash.video[0].baseUrl}`)
}

// 下载音频
const downloadAudio = () => {
    window.open(`${props.playerInfo?.dash.audio[0].baseUrl}`)
}


// 复制视频链接
const copyLink = () => {
    const url = `https://www.bilibili.com/video/${props.videoInfo?.bvid}`
    try {
        navigator.clipboard.writeText(url)
        ElNotification.success('复制成功')
    } catch (err) {
        ElNotification.warning('复制成功')
    }
}


// 分享歌单海报
var drawer = ref(false)
const shareRef = ref(null)
const shareVideoImg = () => {

    _drawShareImg(props.videoInfo, shareRef.value)

    async function _drawShareImg(videoInfo: any, shareRef: any) {
        var context = shareRef.getContext("2d")
		shareRef.width = 1200;
        shareRef.height = 900;

		context.rect(0, 0, shareRef.width, shareRef.height)
		context.fill()
        
        new Promise<void>((resolve) => {

            // 视频封面，等比放大高度至900像素，居中
            var videoImg = new Image()
            videoImg.src = `https://images.weserv.nl/?url=${videoInfo.pic}@600w.webp`
            videoImg.onload = () => {

                let scale = 900 / videoImg.naturalHeight
                videoImg.width = videoImg.naturalWidth * scale
                videoImg.height = 900

                let x = (shareRef.width / 2) - (videoImg.width / 2)
                context.drawImage(videoImg, x, 0, videoImg.width, videoImg.height)

                resolve()
            }

        }).then(() => {

            return new Promise<void>((resolve) => {
                var textShadow = new Image()
                textShadow.src = `https://i.ibb.co/FJjZd0d/share-album-shadow.png@360w.webp`
                textShadow.onload = () => {
                    context.drawImage(textShadow, 0, 540, 1600, 360)

                    context.font = "bold 60px 方正兰亭黑";
                    context.fillStyle = '#FFF'
                    context.fillText(videoInfo.title, 60, 810);

                    resolve()
                }
            })

        }).then(() => {

            return new Promise<void>((resolve) => {
                // 二维码
                var qrImg = new Image()
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&qzone=2&data=https://www.bilibili.com/video/${videoInfo.bvid}@210w.webp`
                qrImg.onload = () => {
                    context.drawImage(qrImg, 1, 1, 208, 208, 60, 470, 210, 210)

                    resolve()
                }
            })
        })
    }
}

</script>

<style scoped>

.share-video {
	width: 600px;
	height: 450px;
	background: #333 !important;
}

.forward-item {
    width: 100%;
    margin-left: 0;
    /* text-align: left; */
}
</style>