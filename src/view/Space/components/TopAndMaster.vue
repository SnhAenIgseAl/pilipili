<template>

    <el-divider content-position="left">
        <h3>代表作</h3>
    </el-divider>

    <div v-if="topVideo || masterVideo" class="top-master">

        <div v-if="topVideo" class="video-item top-video">
            <el-image :src="topVideo.pic" fit="cover" lazy class="video-bg"/>

            <RouterLink :to="`/video/${topVideo.bvid}`">
                <div class="video-info">
                    <div class="video-title">{{ topVideo.title }}</div>
                    <div class="video-stat">
                        <span><i>&#xe81a;</i>{{ topVideo.stat.view }}</span>
                        <span><i>&#xe6ee;</i>{{ topVideo.stat.danmaku }}</span>
                    </div>
                </div>
            </RouterLink>
        </div>

        <div v-if="masterVideo" v-for="(item, index) in masterVideo" :key="index" 
            class="video-item master-video">

            <el-image :src="item.pic" fit="cover" lazy class="video-bg"/>
            
            <RouterLink :to="`/video/${topVideo.bvid}`">
                <div class="video-info">
                    <div class="video-title">{{ item.title }}</div>
                    <div class="video-stat">
                        <span><i>&#xe81a;</i>{{ item.stat.view }}</span>
                        <span><i>&#xe6ee;</i>{{ item.stat.danmaku }}</span>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>

    <el-empty v-if="!topVideo && !masterVideo === false" description="暂无代表作" />

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { fetchData } from '../../../utils/fetchData';
import BiliResType from '../../../type/BiliResType';

// 获取置顶及代表作视频
const topVideo: any = ref(null)
const masterVideo: any = ref(null)
const getTopVideo = async (mid: any) => {
    await fetchData(`/api/space/top?mid=${mid}`, {
    }, (data: BiliResType) => {
        if (data.code == 0) {
			topVideo.value = data.data.topVideo
			masterVideo.value = data.data.masterVideo
		} else {
			ElMessage({message: data.message, type: 'error'})
		}
    })
}



const route = useRoute()
watch(() => route.params.mid, async (newVal) => {
	await getTopVideo(newVal)
}, {
	immediate: true,
})

</script>

<style scoped>

.top-master {
	display: flex;
	flex-flow: row nowrap;
	width: 100%;
	/* margin: 32px 0; */
	overflow: hidden;
}

.video-item {
    position: relative;
	height: 300px;
    min-width: unset;
	background-size: cover;
	background-position: center;
	/* border-radius: 10px; */
    overflow: hidden;

    /* &:hover {
        background-size: 110%;
    } */
} 

.top-video {
	flex: 2;
}

.master-video {
	flex: 1;
}
</style>