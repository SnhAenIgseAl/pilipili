<template>
    <div v-if="props.archive" class="major-video">
        <RouterLink :to="`/video/${props.archive.bvid}`">

        <div class="major-cover"
            :style="{ 
                backgroundImage: `url(${props.archive.cover}@1000w.webp)` 
            }">
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
        width: auto;
        height: 100%;
        background-size: cover;
        background-position: center;
    }

    .major-info {
        position: absolute;
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