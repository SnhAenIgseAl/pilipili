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
                        <img class="avatar-face" :src="`${item.member.avatar}@80w.webp`" />
                        <img v-if="item.member.pendant.image" class="avatar-pendant"
                            :src="`${item.member.pendant.image}@80w.webp`" />
                    </div>



                    <!-- 检查评论状态 -->
                    <CheckCommentStat v-model="item.stat" :type="props.type" :oid="props.oid" :root="item.rpid_str" />

                    <!-- 装扮名称 -->
                    <!-- <Fan v-if="props.author!.decorate" :decorate="props.author!.decorate" /> -->


                    <!-- 主体 -->
                    <div class="comment-content">



                        <!-- 用户名 -->
                        <div class="comment-user">
                            <span v-if="item.member.vip.vipStatus" style="color: var(--cl-primary)">
                                {{ item.member.uname }}
                            </span>
                            <span v-else>
                                {{ item.member.uname }}
                            </span>
                            <Level :level="item.member.level_info.current_level" />
                        </div>
                        




                        <!-- 评论内容 -->
                        <div v-html="item.content.message" class="comment-text" type="info"></div>
                        
                        
                        
                        <!-- 时间点 -->
                        <CommentTimer :text="item.content.message"/>



                        <!-- 评论图片 -->
                        <CommentImgs v-if="item.content.pictures" :imgList="item.content.pictures"/>

                        
                        <div class="comment-control">
                            <!-- ip属地 -->
                            <div class="comment-info">
                                <el-text type="info" size="small">
                                    {{ item.reply_control.time_desc }} · {{ item.reply_control.location }}
                                </el-text>
                            </div>
                            <!-- 评论操作 -->
                            <CommentAction :type="props.type" :oid="props.oid" :rpid="item.rpid" :like="item.like" :liked="item.action" />
                            <CommentAdd :type="props.type" :oid="props.oid" :rpid="item.rpid" />
                        </div>



                        <!-- 显示子评论 -->
                        <CommentChild :subReply="item.reply_control.sub_reply_entry_text" :type="item.type"
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
                <el-input v-model="USER_COMMENT_TXT" :placeholder="dftTxt" resize="none" type="textarea" />

                <div class="reply-control">
                    <div>
                        <el-button text size="small"><i>&#xe64a;</i></el-button>
                        <Mention type="comment"/>
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
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus';
import type BiliResType from '../type/BiliResType';
import { getPlaceholderTxt } from '../utils/commentPlaceholderCfg';
import CommentChild from './CommentChild.vue';
import Level from './Level.vue';
import CommentAction from './CommentAction.vue';
import CommentAdd from './CommentAdd.vue';
import { fetchData } from '../utils/fetchData';
import { parseCommentTxt } from '../utils/parseCommentTxt';
import CheckCommentStat from './CheckCommentStat.vue';
import Mention from './Mention.vue';
import { toRefs } from 'vue';
import { useUserStore } from '../stores/user';
import CommentImgs from './CommentImgs.vue';
import CommentTimer from './CommentTimer.vue';

const props = defineProps({
    type: Number,       // 评论区类型
    oid: String,        // 评论区id
    comments: Number    // 评论数
})



const {
    USER_COMMENT_TXT
} = toRefs(useUserStore())


let commentNum = computed(() => props.comments)  // 评论数
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

            // 转换表情及解析at信息
            for (let i = 0; i < data.data.replies.length; i++) {
                let message = data.data.replies[i].content.message
                let members = data.data.replies[i].content.members
                let emote = data.data.replies[i].content.emote

                data.data.replies[i].content.message = parseCommentTxt(message, emote, members)
            }

            if (page === 0) {
                commentNum = computed(() => data.data.cursor.all_count)
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



const dftTxt = getPlaceholderTxt()



// 清空评论内容
const resetReply = () => {
    USER_COMMENT_TXT.value = ''
}



// 发表评论
const addComment = async () => {
    await fetchData(`/api/reply/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: USER_COMMENT_TXT.value,
            type: props.type,
            oid: props.oid
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            resetReply()
            ElMessage.success('发表评论成功')
        } else {
            ElMessage.error(data.message)
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
    font-size: 14px;
}

.comment-info {
    margin-top: -1px;
}

.comment-text {
    display: flex;
    margin: 8px 0;
    line-height: 1.75;
    font-size: 14px;
    align-content: baseline;
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

    &:visited {
        color: var(--cl-primary);
    }
}
</style>