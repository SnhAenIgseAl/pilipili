<template>

    <div style="width: 120px;">
        <el-button text size="large" @click="drawer = true">
            <i>&#xe6eb;</i>{{ shareCount }}
        </el-button>
    </div>

	<el-dialog 
        v-model="drawer" 
        title="分享视频" 
        width="752"
		@opened="shareVideoImg">

        <canvas ref="shareRef" class="share-video"></canvas>
		
	</el-dialog >

</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    videoInfo: Object,
    num: Number
})

const shareCount = ref(props.num)



// 分享歌单海报
var drawer = ref(false)
const shareRef = ref(null)
const shareVideoImg = () => {

    _drawShareImg(props.videoInfo, shareRef.value)

    async function _drawShareImg(videoInfo: any, shareRef: any) {
        var context = shareRef.getContext("2d")
		shareRef.width = 1440;
        shareRef.height = 900;

		context.rect(0, 0, shareRef.width, shareRef.height)
		context.fill()

        
        const drawVideoPic = new Promise<void>((resolve) => {

            // 视频封面，等比放大高度至900像素，居中
            var videoImg = new Image()
            videoImg.src = `https://images.weserv.nl/?url=${videoInfo.pic}@1440w.webp`
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
                textShadow.src = `https://images.weserv.nl/?url=https://i.ibb.co/FJjZd0d/share-album-shadow.png`
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
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&qzone=2&data=https://www.bilibili.com/video/${videoInfo.bvid}`
                qrImg.onload = () => {
                    context.drawImage(qrImg, 1, 1, 208, 208, 60, 470, 210, 210)

                    resolve()
                }
            })
        })

		// 直接一起画
		const draw = await Promise.all([drawVideoPic])
		draw()
    }
}

</script>

<style scoped>

.share-video {
	width: 720px;
	height: 450px;
	background: #333 !important;
}

</style>