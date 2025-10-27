<template>

    <el-timeline>
        <el-timeline-item
            v-for="(item, index) in replyList" :key="index"
            type="primary"
            size="large"
            :hollow="true"
            :timestamp="item.reply_time"
            placement="top">

            <MsgItemList 
                type="reply"
                :user="item.user"
                :counts="item.counts"
                :business="item.item.business"
                :content="item.item.source_content"
                :root="item.item.root_reply_content"
                :image="IMG_CDN + item.item.image">
            </MsgItemList>
            
        </el-timeline-item>
    </el-timeline>
    

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fetchData } from '../../../utils/fetchData';
import { parseTime } from '../../../utils/parseTime';
import BiliResType from '../../../type/BiliResType';
import { ElMessage } from 'element-plus';
import MsgItemList from '../components/MsgItemList.vue';
import { IMG_CDN } from '../../../config/img.config';

const replyList: any = ref(null)
const getReplyList = async () => {
    await fetchData(`/api/message/reply`, {
    }, (data: BiliResType) => {
        console.log(data)
        if (data.code === 0) {
            for (let i = 0; i < data.data.items.length; i++) {
                data.data.items[i].reply_time = parseTime(data.data.items[i].reply_time)
            }
            replyList.value = data.data.items
        } else {
            ElMessage.error({message: data.message})
        }
    })
}
getReplyList()

</script>

<style scoped>

.msg-item {
    display: flex;
    position: relative;
    width: 100%;
    height: auto;
    padding: 16px 0;
}

.msg-info {
    display: flex;
    margin: 0 16px;
    flex-flow: column;
    justify-content: space-between;
}

.msg-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
}

.msg-content {
    margin: 16px 0;
}

.root-reply {
    border-left: 2px solid #eee;
    padding-left: 8px;
    margin-top: 8px;
    color: var(--cl-black-50);
}

.msg-img {
    position: absolute;
    right: 16px;
    width: 100px;
    height: 60px;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
}

</style>