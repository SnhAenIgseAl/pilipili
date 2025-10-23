<template>

    <div class="live-card" :style="{backgroundImage:  `url(${liveObj.content.live_play_info.cover})`}">

        <a :href="liveObj.content.live_play_info.link" target="_blank">
        <div class="live-info">
            <div class="live-title">
                {{ liveObj.content.live_play_info.title }} · {{ liveObj.content.live_play_info.area_name }}
            </div>
            <div class="live-stat">
                <i>&#xe73d;</i>{{ liveObj.content.live_play_info.watched_show.text_large }}
            </div>
        </div></a>
    </div>

</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps({
    live: Object
})

const liveObj: any = reactive({
    content: reactive({})
})
liveObj.content = JSON.parse(props.live?.content)
</script>

<style scoped>

a {
    display: block;
    width: auto;
    height: 100%;
}

.live-card {
    position: relative;
    width: 100%;
    height: 240px;
    margin-top: 16px;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    overflow: hidden;
}

.live-info {
    position: absolute;
    bottom: 0;
    padding: 8px 16px;
    width: 100%;
    color: #fff;
    background-image: linear-gradient(to top, var(--cl-black), var(--cl-lucency));
}

.live-stat {
    margin-top: 8px;
    color: var(--cl-white-75);
}

</style>