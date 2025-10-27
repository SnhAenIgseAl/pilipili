<template>
    <el-timeline class="timeline">
        <el-timeline-item v-for="(item, index) in historyList" :key="index" :timestamp="item.view_at"
            :color="`var(--cl-primary)`" placement="top">

            <!-- 视频记录 -->
            <RouterLink v-if="item.badge === ''" :to="`/video/${item.history.bvid}`">
                <div class="item">
                    <div class="item-cover"
                        :style="{ backgroundImage: `url(${IMG_CDN}${item.cover}@400w.webp)` }"></div>

                    <div class="item-info">
                        <div class="item-title">
                            {{ item.title }}
                        </div>

                        <div>
                            <el-text type="info" class="item-author">

                                <img :src="`${item.author_face}@60w.webp`"
                                    class="author-face" />

                                <span>{{ item.author_name }} · {{ item.tag_name }}</span>
                            </el-text>
                        </div>

                    </div>
                </div>
            </RouterLink>



            <!-- 专栏记录 -->
            <RouterLink v-if="item.badge === '专栏'" :to="`/read/${item.history.oid}`">
                <div class="item">
                    <div class="item-cover"
                        :style="{ backgroundImage: `url(${IMG_CDN}${item.covers[0]}@400w.webp)` }"></div>

                    <div class="item-info">
                        <div class="item-title">
                            {{ item.title }}
                        </div>

                        <div>
                            <el-text type="info" class="item-author">

                                <img :src="`${item.author_face}@60w.webp`"
                                    class="author-face" />

                                <span>{{ item.author_name }} · {{ item.tag_name }}</span>
                            </el-text>
                        </div>

                    </div>
                </div>
            </RouterLink>

        </el-timeline-item>
    </el-timeline>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import type BiliResType from '../../type/BiliResType'
import { fetchData } from '../../utils/fetchData';
import { parseTime } from '../../utils/parseTime';
import { IMG_CDN } from '../../config/img.config';

const historyList: any = ref(null)
const getHistory = async () => {
    await fetchData(`/api/history`, {
    }, (data: BiliResType) => {
        if (data.code == 0) {

            // 转换时间戳
            for (let i = 0; i < data.data.list.length; i++) {
                data.data.list[i].view_at = parseTime(data.data.list[i].view_at)
            }

            historyList.value = data.data.list
        } else {
            ElMessage({ message: data.message, type: 'error' })
        }
    })
}

getHistory()

</script>

<style scoped>
.timeline {
    margin: 90px auto;
    width: 720px;
}

.item {
    display: flex;
    /* align-items: center; */
    margin-bottom: 16px;
}

.item-cover {
    width: 200px;
    min-width: 200px;
    height: 120px;
    border-radius: 5px;
    margin-right: 16px;
    background-size: cover;
    background-position: center;
}

.item-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .item-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 1.6;
    }

    .item-author {
        display: flex;
        align-items: center;
    }
}

.author-face {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 16px;
}

a {
    color: var(--cl-black);

    &:hover {
        color: var(--cl-primary);
    }
}</style>