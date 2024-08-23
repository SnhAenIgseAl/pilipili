<template>

    <el-divider content-position="left">
        <h3>最近点赞的视频</h3>
    </el-divider>

    <div v-if="likeVideoList" class="video-list">
        <div v-for="(item, index) in likeVideoList" :key="index" 
            class="video-item"
            :style="{backgroundImage: `url(https://images.weserv.nl/?url=${item.pic}@600w.webp)`}">

            <RouterLink :to="`/video/${item.bvid}`">
                <div class="video-info">
                    <div class="video-title">{{ item.title }}</div>
                    <div class="video-stat">
                        <span><i>&#xe736;</i>{{ item.owner.name }}</span>
                        <span><i>&#xe81a;</i>{{ item.stat.view }}</span>
                        <span><i>&#xe6ee;</i>{{ item.stat.danmaku }}</span>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>

    <el-empty v-else description="该用户隐藏了最近点赞视频" />

</template>

<script setup lang="ts">
import { ref} from 'vue'
import { ElNotification } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import { useRoute } from 'vue-router';

const route = useRoute()

const likeVideoList: any = ref(null)
const getLikeVideoList = async () => {
    try {
        let res = await fetch(`/api/space/video/like?mid=${route.params.mid}`)
        let data: BiliResType = await res.json()

        console.log(data)

        if (data.code === 0) {
            likeVideoList.value = data.data.list
        } else {
            ElNotification({message: data.message, type: 'error'})
        }
    } catch (err) {
        ElNotification({message: '服务器连接失败', type: 'error'})
    }
}
getLikeVideoList()

</script>

<style scoped>


</style>