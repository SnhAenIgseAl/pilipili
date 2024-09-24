<template>
    <div v-if="videoInfo" class="video-box">

        <VideoControl v-if="playerInfo" 
            :videoInfo="videoInfo" 
            :playerInfo="playerInfo"/>

        <div class="video-action">

            <div class="action-item">
                <!-- 视频推荐 -->
                <Related :bvid="videoInfo.bvid" />

                <!-- 视频信息 -->
                <Desc :videoInfo="videoInfo" :pageList="pageList" />

                <!-- 视频操作 -->
                <Like :aid="videoInfo.aid" :num="videoInfo.stat.like" />
                <TouBi :aid="videoInfo.aid" :num="videoInfo.stat.coin" />
                <Collect :rid="videoInfo.aid" :num="videoInfo.stat.favorite"/>
                <Forward :videoInfo="videoInfo" :playerInfo="playerInfo" :num="videoInfo.stat.share" />

                <!-- 视频评论 -->
                <Comments :type="1" :oid="`${videoInfo.aid}`" :comments="videoInfo.stat.reply" />
            </div>

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
import { ref, Ref, watch } from 'vue'
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
import { fetchData } from '../../utils/fetchData'

const route = useRoute()

const videoInfo: Ref<any> = ref(null)
const playerInfo: Ref<any> = ref(null)
const upInfo: Ref<any> = ref(null)
const pageList: Ref<any> = ref(null)
const attr: Ref<number> = ref(0)
const bv: Ref<string> = ref('')
const cid: Ref<number> = ref(0)

// 获取视频信息及播放地址
const getVideoInfo = async (bvid: string) => {
    await fetchData(`/api/video?bvid=${bvid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            // console.log(data.data)

            // 转换时间戳
            data.data.View.pubdate = parseTime(data.data.View.pubdate)

            videoInfo.value = data.data.View
            // console.log(videoInfo.value)
            upInfo.value = data.data.Card
            attr.value = data.data.Card.following ? 2 : 0
            bv.value = data.data.View.bvid
            cid.value = data.data.View.cid          // 第一p的cid
            pageList.value = data.data.View.pages   // 视频分p列表

            if (!pageList.value || !route.query.p) {
                getPlayerInfo(bv.value, cid.value)
            } else {
                let pNumber: number = parseInt(route.query.p as string)    

                // 防止刁民p值不合法
                pNumber = pNumber - 1 <= 0 ? 1 : pNumber     
                pNumber = pNumber - 1 >= pageList.value.length ? pageList.value.length : pNumber

                console.log('pNumber: ' + pNumber)

                // 用户习惯，1p对应分配列表下标0
                getPlayerInfo(bv.value, pageList.value[pNumber- 1].cid) 
            }
        } else {
            ElMessage.error(data.message)
        }
    })
}



// 获取视频播放地址
const getPlayerInfo = async (bv: string, cid: number) => {
    await fetchData(`/api/player?bvid=${bv}&cid=${cid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            // console.log(data)
            playerInfo.value = data.data

        } else if (data.code === 87007) {
            ElMessage.warning('OnlyFans')
        } else {
            ElMessage.warning(data.message)
        }
    })
}


watch(() => route.params.bvid, async (newValue: any) => {
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
    padding-left: 86px;
    padding-right: 16px;
}

.video-action {
    position: relative;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    width: 100%;
}

.action-item {
    display: flex;
    align-items: center;
    width: auto;
    min-width: 1060px;
    height: 60px;
}

.video-up {
    float: right;
    margin-right: 0;
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
    min-width: 60px;
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