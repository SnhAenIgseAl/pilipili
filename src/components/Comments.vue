<template>
    <el-button text size="large" @click="commentVisible = true">
        <i>&#xe667;</i>{{ commentNum }}
    </el-button>

    <el-drawer v-model="commentVisible" title="评论详情" size="600" @opened="getCommentsList(0, 3)">

        <template #header>
            <div>
                <p>评论详情</p><br />

                <el-button text @click="getCommentsList(0, 3)">最热</el-button>
                <el-divider direction="vertical" />
                <el-button text @click="getCommentsList(0, 2)">最新</el-button>
            </div>
        </template>



        <template #default>

            <el-scrollbar>

                <!-- 父评论 -->
                <div class="comment-parent" v-for="(item, index) in commentsList" :key="index">

                    <!-- 头像及头像框 -->
                    <div class="avatar-img">
                        <img class="avatar-face" :src="`https://images.weserv.nl/?url=${item.member.avatar}@80w.webp`" />
                        <img v-if="item.member.pendant.image" class="avatar-pendant"
                            :src="`https://images.weserv.nl/?url=${item.member.pendant.image}@80w.webp`" />
                    </div>



                    <!-- 装扮名称 -->
                    <!-- <Fan v-if="props.author!.decorate" :decorate="props.author!.decorate" /> -->


                    <!-- 主体 -->
                    <div class="comment-content">



                        <!-- 用户名及发布时间ip属地 -->
                        <div class="comment-user">
                            <span v-if="item.member.vip.vipStatus" style="color: var(--cl-primary)">
                                {{ item.member.uname }}
                            </span>
                            <span v-else>
                                {{ item.member.uname }}
                            </span>
                            <Level :level="item.member.level_info.current_level" />
                        </div>
                        <div class="comment-info">
                            <el-text type="info">{{ item.reply_control.time_desc }}</el-text>
                            <el-text v-if="item.reply_control.location" type="info">
                                · {{ item.reply_control.location }}
                            </el-text>
                        </div>




                        <!-- 评论内容 -->
                        <div v-html="item.content.message" class="comment-text" type="info"></div>



                        <!-- 评论操作 -->
                        <div class="comment-control">
                            <CommentAction :type="props.type" :oid="props.oid" :rpid="item.rpid" :like="item.like" />
                            <CommentAdd :type="props.type" :oid="props.oid" :rpid="item.rpid" />
                        </div>



                        <!-- 显示子评论 -->
                        <ComentChild :subReply="item.reply_control.sub_reply_entry_text" :type="item.type"
                            :root="item.rpid_str" :oid="item.oid_str" />

                    </div>
                </div>

                <!-- 显示更多评论 -->
                <el-divider v-if="!isEnd">
                    <el-button text @click="getCommentsList(++currentPage, commentMode)">显示更多评论</el-button>
                </el-divider>

            </el-scrollbar>
        </template>




        <!-- 发表评论 -->
        <template #footer>
            <div class="reply-box">
                <el-input v-model="repltTxt" :placeholder="dftTxt" resize="none" type="textarea" />

                <div class="reply-control">
                    <div>
                        <el-button text size="small"><i>&#xe64a;</i></el-button>
                        <el-button text size="small">@</el-button>
                    </div>

                    <div>
                        <el-button @click="resetReply">清空</el-button>
                        <el-button type="primary" @click="addComment">发布</el-button>
                    </div>
                </div>
            </div>
        </template>


    </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import type BiliResType from '../type/BiliResType';
import { getPlaceholderTxt } from '../utils/commentPlaceholderCfg';
import parseEmoji from '../utils/parseEmoji';
import ComentChild from './ComentChild.vue';
import Level from './Level.vue';
import CommentAction from './CommentAction.vue';
import CommentAdd from './CommentAdd.vue';
import { fetchData } from '../utils/fetchData';
import { parseCommentTxt } from '../utils/parseCommentTxt';

const props = defineProps({
    type: Number,       // 评论区类型
    oid: String,        // 评论区id
    comments: Number    // 评论数
})


const commentNum = ref(props.comments)  // 评论数
const commentPageTotal = ref(0)         // 评论总页码
const currentPage = ref(1)              // 评论当前页码
const isEnd = ref(false)                // 是否为最后一页
const commentMode = ref(3)              // 评论模式（0，3为最热，2为最新）
const commentVisible = ref(false)       // 是否显示子评论
const commentsList: any = ref([])



// 获取评论列表
const getCommentsList = async (page: Number, mode: Number) => {
    await fetchData(`/api/comments?type=${props.type}&oid=${props.oid}&page=${page}&mode=${mode}`, {
    }, (data: BiliResType) => {
        console.log(data)
        if (data.code === 0) {

            // 转义表情及解析at信息
            for (let i = 0; i < data.data.replies.length; i++) {
                data.data.replies[i].content.message = parseCommentTxt(data.data.replies[i].content.message, data.data.replies[i].content.members)
            }

            if (page === 0) {
                commentNum.value = data.data.cursor.all_count
                commentsList.value = data.data.replies
            } else {
                let newList = [...commentsList.value, ...data.data.replies]
                commentsList.value = newList
            }
            // console.log(commentsList.value)

            commentPageTotal.value = Math.floor(data.data.cursor.all_count / 20) + 1
            isEnd.value = currentPage.value === commentPageTotal.value
        } else {
            ElMessage.warning({ message: data.message })
        }
    })
}



const repltTxt = ref(null)
const dftTxt = getPlaceholderTxt()



// 清空评论内容
const resetReply = () => {
    repltTxt.value = null
}



// 发表评论
const addComment = async () => {
    await fetchData(`/api/reply/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: repltTxt.value,
            type: props.type,
            oid: props.oid
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            resetReply()
            ElMessage({ message: '发表评论成功', type: 'success' })
        } else {
            ElMessage({ message: data.message, type: 'error' })
        }
    })
}


</script>

<style scoped>
.comment-parent {
    position: relative;
    display: flex;
    margin-bottom: 10px;
    padding: 0 16px;
}

.avatar-face {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 8px 10px;
}

.avatar-pendant {
    position: absolute;
    widows: 65px;
    height: 65px;
    left: 16px;
    top: -5px;
}

.comment-content {
    flex: 1;
    padding: 10px 10px;

    border-bottom: 1px solid #f0f0f0;
}

.comment-user {
    display: flex;
    align-items: center;
    font-weight: 500;
    margin-bottom: 8px;
}

.comment-info {}

.comment-text {
    display: flex;
    margin: 8px 0;
    line-height: 1.75;
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

.reply-box {
    /* position: fixed; */
    width: 600px;
    bottom: 0;
    margin: 0;
    padding: 16px;
    background-color: #fff;
    box-shadow: var(--el-box-shadow-light);

    .reply-control {
        display: flex;
        justify-content: space-between;
        align-items: top;
        margin-top: 8px;
    }
}
</style>

<style>
.comment-text_img {
    width: 22px;
    height: 22px;
}

.at-uname {
    color: var(--cl-primary);

    &:hover {
        cursor: pointer;
    }
}
</style>