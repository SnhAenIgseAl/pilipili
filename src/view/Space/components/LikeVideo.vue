<template>
    <el-divider content-position="left">
        <h3>最近点赞的视频</h3>
    </el-divider>

    <div v-if="likeVideoList" class="video-list">
        <div v-for="(item, index) in likeVideoList" :key="index" class="video-item">

            <el-image :src="item.pic" fit="cover" lazy class="video-bg"/>

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
import { ref, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import { useRoute } from 'vue-router';
import { fetchData } from '../../../utils/fetchData';

const route = useRoute()

const likeVideoList: Ref<any> = ref(null)
const getLikeVideoList = async () => {
    await fetchData(`/api/space/video/like?mid=${route.params.mid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            likeVideoList.value = data.data.list
        } else {
            ElNotification.warning(data.message)
        }
    })
}
getLikeVideoList()

</script>

<style scoped></style>