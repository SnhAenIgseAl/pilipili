<template>

    <el-button text size="large" @click="descVisible = true">
        <i>&#xe791;</i>视频简介
    </el-button>

    <el-drawer v-model="descVisible" 
        title="视频简介"
        size="600">

        <template #default>
            <el-text style="padding: var(--el-drawer-padding-primary);">
                {{ props.text }}
            </el-text>
        </template>
        
    </el-drawer>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    text: String
})


const descVisible = ref(false)

</script>

<style scoped>

</style>