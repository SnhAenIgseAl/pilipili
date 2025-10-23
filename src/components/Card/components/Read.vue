<template>

    <a :href="props.article?.jump_url" target="_blank" class="read-box">
        <div class="read-title">
            {{ props.article?.title }}
        </div>
        <el-text type="info">
            {{ props.article?.desc }}
        </el-text>
        <img :src="`${props.article?.covers[0]}@1000w.webp`" 
            class="read-img"/>
    </a>

</template>

<script setup lang="ts">

const props = defineProps({
    article: Object
})

</script>

<style scoped>

.read-title {
    font-size: 16px;
    font-weight: bold;
    margin: 8px 0;
}

.read-img {
    width: 100%;
    border-radius: 8px;
    margin-top: 8px;
}

</style>