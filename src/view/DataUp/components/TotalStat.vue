<template>

    
    <h3 style="padding: 0 16px;">新增数据</h3>
    <div class="statictic-content">
        
        <div v-for="(value, key, index) in staticticsStat"
            class="statictics-item" 
            :key="index">
            <el-text>{{ key }}</el-text>
            <h3 style="margin: 4px 0;">{{ value }}</h3>
        </div>

    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { fetchData } from '../../../utils/fetchData';
import BiliResType from '../../../type/BiliResType';
import { ElMessage } from 'element-plus';

let staticticsStat = reactive({
    '播放': 0,
    '粉丝': 0,
    '点赞': 0,
    '收藏': 0,
    '硬币': 0,
    '评论': 0,
    '弹幕': 0,
    '分享': 0,
})

let totalStat = reactive({
    '播放': 0,
    '粉丝': 0,
    '点赞': 0,
    '收藏': 0,
    '硬币': 0,
    '评论': 0,
    '弹幕': 0,
    '分享': 0,
    '充电': 0,
})

const getStaticticsStat = async () => {
    await fetchData(`/api/dataup/stat`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            staticticsStat.硬币 = data.data.inc_coin
            staticticsStat.播放 = data.data.incr_click
            staticticsStat.粉丝 = data.data.incr_fans
            staticticsStat.点赞 = data.data.inc_like
            staticticsStat.收藏 = data.data.inc_fav
            staticticsStat.评论 = data.data.incr_reply
            staticticsStat.弹幕 = data.data.incr_dm
            staticticsStat.分享 = data.data.inc_share

            totalStat.硬币 = data.data.total_coin
            totalStat.播放 = data.data.total_click
            totalStat.粉丝 = data.data.total_fans
            totalStat.点赞 = data.data.total_like
            totalStat.收藏 = data.data.total_fav
            totalStat.评论 = data.data.total_reply
            totalStat.弹幕 = data.data.total_dm
            totalStat.分享 = data.data.total_share
            totalStat.充电 = data.data.total_elec
        } else {
            ElMessage.error(data.message)
        }
    })
}
getStaticticsStat()

</script>

<style scoped>

.statictic-content {
    padding: 16px;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    height: auto;
    gap: 32px;

    .statictics-item {
        flex: 1;
        min-width: 150px;
        height: auto;
        padding: 8px 16px;
        border-radius: 8px;
        background-color: #efefef;
    }
}

</style>
