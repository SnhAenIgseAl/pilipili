<template>
    <div v-if="videoInfo" class="video-box">

        <VideoControl v-if="playerInfo && videoInfo" :playerInfo="playerInfo" :videoInfo="videoInfo" />

        <div class="video-action">
            <!-- 视频推荐 -->
            <Related :bvid="videoInfo.bvid" />

            <!-- 视频简介 -->
            <Desc :videoInfo="videoInfo" />

            <!-- 视频操作 -->
            <Like :aid="videoInfo.aid" :num="videoInfo.stat.like" />
            <TouBi :aid="videoInfo.aid" :num="videoInfo.stat.coin" />
            <Collect :rid="videoInfo.aid" :num="videoInfo.stat.favorite"/>
            <Forward :videoInfo="videoInfo" :num="videoInfo.stat.share" />

            <!-- 视频评论 -->
            <Comments :type="1" :oid="`${videoInfo.aid}`" :comments="videoInfo.stat.reply" />

            <!-- up信息 -->
            <div class="video-up">
                <RouterLink :to="`/space/${videoInfo.owner.mid}/home`" class="up-link">
                    <img :src="`https://images.weserv.nl/?url=${videoInfo.owner.face}@80w.webp`" class="up-face" />
                    <el-text type="info" class="up-name">
                        {{ videoInfo.owner.name }}
                    </el-text>
                </RouterLink>
                <AttrButton :mid="videoInfo.owner.mid" :attr="attr"/>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type BiliResType from '../../type/BiliResType'
import Related from './components/Related.vue'
import Desc from './components/Desc.vue'
import Like from './components/Like.vue'
import TouBi from './components/TouBi.vue'
import Collect from './components/Collect.vue'
import Forward from './components/Forward.vue'
import Comments from '../../components/Comments.vue'
import VideoControl from './components/VideoControl.vue'
import { parseTime } from '../../utils/parseTime'
import AttrButton from '../../components/AttrButton.vue'

const route = useRoute()

const videoInfo: any = ref(null)
const upInfo: any = ref(null)
const attr = ref(0)
const bv = ref(null)
const cid = ref(null)
const playerInfo: any = ref(null)

// 获取视频信息及播放地址
const getVideoInfo = async (bvid: string | string[]) => {
    try {
        let res = await fetch(`/api/video?bvid=${bvid}`)
        let data: BiliResType = await res.json()

        if (data.code === 0) {
            // console.log(data.data)

            // 转换时间戳
            data.data.View.pubdate = parseTime(data.data.View.pubdate)

            videoInfo.value = data.data.View
            console.log(videoInfo.value)
            upInfo.value = data.data.Card
            attr.value = data.data.Card.following ? 2 : 0
            bv.value = data.data.View.bvid
            cid.value = data.data.View.cid
        } else {
            ElMessage({ message: data.message, type: 'error' })
        }
    } catch (err) {
        ElMessage({ message: '网络未连接', type: 'error' })
    }

    try {
        let res = await fetch(`/api/player?bvid=${bv.value}&cid=${cid.value}`)
        let data: BiliResType = await res.json()

        if (data.code === 0) {
            // console.log(data)
            playerInfo.value = data.data
        } else if (data.code === 87007) {
            ElMessage.warning({ message: 'OnlyFans' })
        } else {
            ElMessage.error({ message: data.message })
        }
    } catch (err) {
        ElMessage({ message: '视频播放失败', type: 'error' })
    }
}



watch(() => route.params.bvid, async (newValue: string | string[]) => {
    console.log(route.params.bvid)
    await getVideoInfo(newValue)
}, {
    immediate: true
})

</script>

<style scoped>
html,
body {
    overflow-x: hidden;
    height: 100%;
}

.video-box {
    position: absolute;
    display: flex;
    flex-flow: column;
    align-items: center;
    width: calc(100%);
    min-width: 960px;
    height: calc(100%);
    padding-top: 60px;
}

.video-action_box {
    display: flex;
    width: 1280px;
    align-items: center;
    justify-content: space-between;
}

.video-action {
    position: relative;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    height: 60px;
    width: 1280px;
}

.video-up {
    position: absolute;
    right: 0;
    display: flex;
    flex-flow: row;
    align-items: center;
    height: 60px;
    width: auto;
}

.up-link {
    display: flex;
    flex-flow: row;
    align-items: center;
    height: 60px;
    width: auto;
}

.up-name {
    width: auto;
    margin: 0 16px;
    font-size: 16px;
    font-weight: bold;
}

.up-face {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>