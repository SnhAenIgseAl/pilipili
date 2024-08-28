<template>

    <div class="card-item">

        <!-- 头像及头像框 -->
        <div class="avater-img">
            <img :src="`https://images.weserv.nl/?url=${props.author!.face}@100w.webp` " class="avater-face"/>
            <img v-if="props.author!.pendant?.image" class="pendant" :src="`https://images.weserv.nl/?url=${props.author!.pendant.image}@100w.webp`" />
        </div>



        <!-- 装扮名称 -->
        <Fan v-if="props.author!.decorate" :decorate="props.author!.decorate" />



        <!-- 主体 -->
        <div class="card-body">

            <!-- 用户名和更新时间 -->
            <RouterLink :to="`/space/${props.author!.mid}/home`"><div class="pub-name">
                <span v-if="props.author!.vip?.status" style="color: var(--cl-primary);">{{ props.author!.name }}</span>
                <span v-else>{{ props.author!.name }}</span>
            </div></RouterLink>
            <el-text type="info">
                {{ props.author!.pub_time }}
                <span v-if="props.author!.pub_action"> · {{ props.author!.pub_action }}</span>
            </el-text>



            <!-- 文字描述 -->
            <div v-if="props.dynamic!.desc" class="card">
                <el-text class="card_text">{{ props.dynamic!.desc.text }}</el-text>
            </div>



            <!-- 动态投稿内容 -->
            <div v-if="props.dynamic!.major">

                <!-- 视频 -->
                <Video v-if="props.dynamic!.major.archive" :archive="props.dynamic!.major.archive!" />

                <!-- 图片 -->
                <Image v-if="props.dynamic!.major.draw" :draw="props.dynamic!.major.draw!"></Image>

                <!-- 直播 -->
                <Live v-if="props.dynamic!.major.live_rcmd" :live="props.dynamic!.major.live_rcmd!"/>
            </div>



            <!-- 转发动态的内容 -->
            <div v-if="props.orig" class="major-forward">
                
                <RouterLink :to="`/space/${props.orig.modules.module_author.mid}`">
                    <el-text info>{{ props.orig.modules.module_author.name }}</el-text>
                    <el-text info v-if="props.orig.modules.module_author.pub_action"> · {{ props.orig.modules.module_author.pub_action }}</el-text>
                </RouterLink>
                <br />

                <!-- 文字 -->
                <div v-if="props.orig.modules.module_dynamic.desc" class="forward-text">{{ props.orig.modules.module_dynamic.desc.text }}</div>

                <div v-if="props.orig.modules.module_dynamic.major">
                    <!-- 投稿视频 -->
                    <Video :archive="props.orig.modules.module_dynamic.major.archive" />

                    <!-- 分享图片 -->
                    <Image :draw="props.orig.modules.module_dynamic.major.draw"></Image>
                </div>
            </div>



            <!-- 操作 -->
            <div class="card-state">
                <Forward 
                    :dynId="props.id_str"
                    :num="props.stat!.forward.count"
                />
                
                <Comments 
                    :type="props.basic!.comment_type"
                    :oid="props.basic!.comment_id_str"
                    :comments="props.stat!.comment.count"
                />
                <Like 
                    :dyId="props.id_str"
                    :like="props.stat!.like"
                />
            </div>

            <!-- 更多操作 -->
            <More :more="props.more"/>
            
        </div>
    </div>

</template>

<script setup lang="ts">
import Fan from './components/Fan.vue'
import Comments from '../../components/Comments.vue'
import Video from './components/Video.vue'
import Image from './components/Image.vue'
import Like from './components/Like.vue'
import Live from './components/Live.vue'
import Forward from './components/Forward.vue'
import More from './components/More.vue'

const props = defineProps({
    id_str: String,
    basic: Object,
    author: Object,
    dynamic: Object,
    more: Object,
    stat: Object,
    orig: Object
})

</script>

<style scoped>

.card-item {
    position: relative;
	display: flex;
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    background-color: var(--cl-white);
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    
}

.avater-img {
    /* float: left; */
    position: relative;
    width: 80px;
    min-width: 80px;
    height: 100%;
    border: 50%;
}

.avater-face {
    width: 50px;
    height: 50px;
    margin: 5px;
    border-radius: 50%;
}

.pendant {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 80px;
    height: 80px;
}

.pub-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--cl-black);
    margin: 8px 0;
}

.card-body {
	flex: 1;
}

.card {
    margin: 10px 0;
}

.card_text {
    color: var(--cl-black) !important;
    line-height: 1.8;
}

.major-video {
    display: flex;
    width: auto;
    height: 150px;
    margin: 10px 0;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #f0f0f0;

    .major-cover {
        width: 240px;
        background-size: contain;
    }

    .major-info {
        width: auto;
        padding: 16px;
        /* height: 120px; */

        .major-info_title {
            color: var(--cl-black) !important;
            font-weight: 500;
        }
    }
}

.major-draw {
    display: flex;
    width: 100%;
    margin: 10px 0;
    border-radius: 10px;
    overflow: hidden;

    .draw-box {
        width: 100%;

        .draw-cover {
            width: 100%;
        }
    }
}

.major-forward {
    width: 100%;
    padding: 16px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    margin-bottom: 10px;

    .forward-text {
        font-size: 14px;
        margin: 16px 0;
        line-height: 1.8;
    }
}

.card-state {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 80px);
    height: 30px;
    font-size: 14px;
    margin-top: 16px;
}

</style>