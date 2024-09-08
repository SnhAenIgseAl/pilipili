<template>
    
    <!-- 显示子评论按钮 -->
    <el-divider v-if="props.subReply">
        <el-button v-if="subCommentsVisible === false" 
            text 
            @click="getSubComments">
            展开{{ props.subReply }}
        </el-button>
    </el-divider>


    <!-- 子评论 -->
    <div v-if="subCommentsVisible" v-for="(item, index) in subComments" :key="index" class="sub-comments_item">

        <!-- 头像及头像框 -->
        <div class="avatar-img">
            <img class="avatar-face" :src="`https://images.weserv.nl/?url=${item.member.avatar}@80w.webp`" />
            <img v-if="item.member.pendant.image" class="avatar-pendant"
                :src="`https://images.weserv.nl/?url=${item.member.avatar}@80w.webp`" />
        </div>



        <!-- 主体 -->
        <div class="comment-content">

            <!-- 用户名及发布时间ip属地 -->
            <div class="comment-user">
                <span v-if="item.member.vip.vipStatus" :style="{ color: `var(--cl-primary)` }">
                    {{ item.member.uname }}
                </span>
                <span v-else>
                    {{ item.member.uname }}
                </span>
                <Level :level="item.member.level_info.current_level" />
            </div>



            <!-- 评论内容 -->
            <div v-html="item.content.message" class="comment-text" type="info"></div>


            
            <div class="comment-control">
                <!-- ip属地 -->
                <div class="comment-info">
                    <el-text type="info">
                        {{ item.reply_control.time_desc }} · {{ item.reply_control.location }}
                    </el-text>
                </div>
                <!-- 评论操作 -->
                <CommentAction :type="props.type" :oid="props.oid" :rpid="item.rpid" :like="item.like" />
                <CommentAdd :type="props.type" :oid="props.oid" :rpid="item.rpid" />
            </div>
        </div>
    </div>



    <!-- 分页按钮，只有一页时隐藏 -->
    <div class="sub-reply-page">
        <el-pagination v-if="subCommentsVisible" 
            layout="prev, pager, next"
            size="small"  
            :total="pageTotal"
            :page-size="10"
            :hide-on-single-page=true 
            @current-change="changePage"/>
    </div>
    



    <!-- 收起按钮 -->
    <el-divider v-if="subCommentsVisible">
        <el-button text @click="subCommentsVisible = false">收起</el-button>
    </el-divider>


</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import type BiliResType from '../type/BiliResType'
import Level from './Level.vue';
import CommentAction from './CommentAction.vue';
import CommentAdd from './CommentAdd.vue';
import { fetchData } from '../utils/fetchData';
import { parseCommentTxt } from '../utils/parseCommentTxt';

const props = defineProps({
    subReply: String,
    type: Number,
    root: String,
    oid: String
})



// 获取子评论
const pageTotal: Ref<number> = ref(0)
const subCommentsVisible: Ref<boolean> = ref(false)
const subComments: Ref<any> = ref(null)
const getSubComments = async (page: number) => {

    subCommentsVisible.value = true

    await fetchData(`/api/subComments?type=${props.type}&oid=${props.oid}&root=${props.root}&page=${page}`, {
    }, (data: BiliResType) => {
        console.log(data)

        if (data.code == 0) {
            let replies = data.data.replies

            for (let i = 0; i < replies.length; i++) {
                replies[i].content.message = parseCommentTxt(replies[i].content.message, replies[i].content.members)
            }

            subComments.value = replies
            pageTotal.value = data.data.page.count
        } else {
            ElMessage.error({ message: data.message })
        }
    })
}



// 评论翻页
const changePage = async (page: number) => {
    await getSubComments(page)
}

</script>

<style scoped>
.sub-comments_item {
    display: flex;
    flex-flow: row nowrap;
}

.avatar-face {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 8px 0px;
}

.avatar-pendant {
    position: absolute;
    widows: 65px;
    height: 65px;
    left: -5px;
    top: -5px;
}

.comment-content {
    flex: 1;
    padding: 10px 16px;
}

.comment-user {
    display: flex;
    align-items: center;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 14px;
}

.comment-info {}

.comment-text {
    margin: 8px 0 8px;
    line-height: 24px;
    font-size: 14px;
}

.comment-control {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    span {
        margin-right: 16px;
    }
}

.sub-reply-page {
    display: flex;
    justify-content: center;
    /* margin-top: 16px; */
}
</style>

<style>
.at-name {

}
</style>