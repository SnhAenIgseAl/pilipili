<template>

    <el-button text size="large" @click="descVisible = true">
        <i>&#xe791;</i>视频简介
    </el-button>

    <el-drawer v-model="descVisible" 
        title="视频简介"
        size="600">

        <template #default>
            <div class="desc">
                发布于{{ props.videoInfo?.pubdate }}
            </div>
            <div class="desc">
                {{ props.videoInfo?.desc }}
            </div>

        </template>
        
    </el-drawer>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    videoInfo: Object
})


const descVisible = ref(false)

</script>

<style scoped>

.desc {
    padding: var(--el-drawer-padding-primary);
    color: var(--cl-black-75);
    font-size: 14px;
}

</style>