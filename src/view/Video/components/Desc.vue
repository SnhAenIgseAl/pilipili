<template>

    <el-button text size="large" @click="descVisible = true">
        <i>&#xe791;</i>视频信息
    </el-button>

    <el-drawer v-model="descVisible" 
        title="视频信息"
        size="600">

        <template #default>
            <div class="desc">
                <h3 class="desc-title">标题</h3>
                <el-text type="info">{{ props.videoInfo?.title }}</el-text>
            </div>
            <div class="desc">
                <h3 class="desc-title">时间</h3>
                <el-text type="info">发布于{{ props.videoInfo?.pubdate }}</el-text>
            </div>
            <div class="desc">
                <h3 class="desc-title">简介</h3>
                <el-text type="info">{{ props.videoInfo?.desc }}</el-text>
            </div>
            <div v-if="props.pageList" class="desc">
                <h3 class="desc-title">选集</h3>
                <el-radio-group v-model="pNumber">
                    <el-radio v-for="(item, index) in props.pageList" 
                        :value="index + 1" 
                        size="large" 
                        border
                        @click="changePage(index + 1)">
                        {{ item.part }}
                    </el-radio>
                </el-radio-group>
            </div>
        </template>
        
    </el-drawer>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    videoInfo: Object,
    pageList: Array as any
})

const route = useRoute()


const descVisible: Ref<boolean> = ref(false)


// 当前视频分p
const pNumber: Ref<number> = ref(parseInt(route.query.p as string))



// 切换分p
const changePage = (page: number) => {
    window.location.href = `/video/${route.params.bvid}?p=${page}`
}

</script>

<style scoped>

.desc {
    padding: var(--el-drawer-padding-primary);
    color: var(--cl-black-75);
    font-size: 14px;
}

.desc-title {
    margin-bottom: 12px;
}

</style>