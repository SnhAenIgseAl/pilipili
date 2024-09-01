<template>

    <div v-for="(item, index) in props.data" :key="index" class="list-item">

        <!-- 视频封面 -->
        <RouterLink :to="`/video/${item.bvid}`">
            <div class="pic" :style="{ backgroundImage: `url(https://images.weserv.nl/?url=http:${item.pic}@300w.webp)` }">
                <div class="stat">
                    <span><i>&#xe73d;</i>{{ item.play }}</span>
                    <span><i>&#xe644;</i>{{ item.like }}</span>
                    <div style="float: right;">{{ item.duration }}</div>
                </div>
            </div>

            <!-- 视频作者信息 -->
            <RouterLink :to="`/space/${item.mid}/home`">
                <div class="info">
                    <div class="info-title" v-html="item.title"></div>
                    <div class="info-author">
                        <img :src="`https://images.weserv.nl/?url=${item.upic}@30w.webp`" class="upic" />
                        <el-text type="info">{{ item.author }} · {{ item.pubdate }}</el-text>
                    </div>
                </div>
            </RouterLink>
        </RouterLink>
    </div>

</template>

<script setup lang="ts">
import { parseTime } from '../../../utils/parseTime';


const props = defineProps({
    type: String,
    data: Object
})

// 转换时间戳
for (let i = 0; i < props.data?.length; i++) {
    props.data![i].pubdate = parseTime(props.data![i].pubdate)
}



</script>

<style scoped>
.list-item {
    flex: 1;
    min-width: 270px;
    height: 240px;
    margin-bottom: 30px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
        cursor: pointer;
        box-shadow: var(--el-box-shadow);
    }

    a {
        color: var(--cl-black);
    }
}

.pic {
    display: flex;
    align-items: end;
    height: 60%;

    background-size: cover;
    background-position: center;
}

.stat {
    width: 100%;
    padding: 12px;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(to top, #111, var(--cl-lucency));

    span {
        margin-right: 12px;
    }
}

.info {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 40%;
    padding: 12px;

    .info-title {
        line-height: 1.8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .info-author {
        display: flex;

        .upic {
            width: 30;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }
}
</style>

<style>
.keyword {
    color: var(--cl-primary);
    font-style: normal;
}
</style>