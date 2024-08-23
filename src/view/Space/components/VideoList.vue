<template>
    <el-divider content-position="left">
        <h3>投稿视频</h3>
    </el-divider>

    <div v-if="props.videoList" class="video-list">
        <div v-for="(item, index) in props.videoList" :key="index" class="video-item"
            :style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.cover}@600w.webp)` }">

            <RouterLink :to="`/video/${item.bvid}`">
                <div class="video-info">
                    <div class="video-title">{{ item.title }}</div>
                    <div class="video-stat">
                        <span><i>&#xe81a;</i>{{ item.play }}</span>
                        <span><i>&#xe6ee;</i>{{ item.danmaku }}</span>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { ref, watch } from "vue";
// import { useRoute } from "vue-router";
// import { ElMessage } from "element-plus";

const props = defineProps({
    videoList: Object
})

</script>

<style scoped></style>