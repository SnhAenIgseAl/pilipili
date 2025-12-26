<template>
    <div v-if="props.archive" class="major-video">
        <RouterLink :to="`/video/${props.archive.bvid}`">

        <!-- <div class="major-cover"
            :style="{ 
                backgroundImage: `url(${IMG_CDN}${props.archive.cover}@1000w.webp)` 
            }"> -->
        <div class="major-cover">
            <img :src="`${props.archive.cover}@1000w.webp`" class="major-cover_img" />
        </div>
        
        <div class="major-info">
            <div class="major-info_title">{{ props.archive.title }}</div>
            <div class="major-info_stat">
                <span><i>&#xe73d;</i>{{ props.archive.stat.play }}</span>
                <span><i>&#xe6ee;</i>{{ props.archive.stat.danmaku }}</span>
            </div>
        </div>

        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import { IMG_CDN } from '../../../config/img.config'

const props = defineProps({
    archive: Object
})

</script>

<style scoped>
.major-video {
    position: relative;
    width: auto;
    height: 240px !important;
    margin: 10px 0;
    border-radius: 10px;
    overflow: hidden;

    .major-cover {
        position: relative;
        z-index: 1;
        width: auto;
        height: 100%;
        background-size: cover;
        background-position: center;
    }

    .major-cover_img {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        object-fit: cover;
    }

    .major-info {
        position: absolute;
        z-index: 9;
        bottom: 0px;
        width: 100%;
        padding: 8px 16px;
        background: linear-gradient(to top, var(--cl-black), var(--cl-lucency));

        .major-info_title {
            color: #fff;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .major-info_stat {
            color: var(--cl-white-75);
            /* font-weight: 500; */

            span {
                margin-right: 16px;
            }
        }
    }
}

a {
    width: 100%;
}
</style>