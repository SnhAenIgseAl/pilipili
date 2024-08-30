<template>

    <el-timeline>
        <el-timeline-item
            v-for="(item, index) in atMeList" :key="index"
            type="primary"
            size="large"
            :hollow="true"
            :timestamp="item.at_time"
            placement="top">

            <MsgItemList 
                type="at"
                :users="null"
                :user="item.user"
                :counts="item.counts"
                :business="item.item.business"
                :content="item.item.source_content"
                :root="item.item.root_reply_content"
                :image="item.item.image">
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

const atMeList: any = ref(null)
const getAtMeList = async () => {
    await fetchData(`/api/message/at`, {
    }, (data: BiliResType) => {
        console.log(data)
        if (data.code === 0) {
            for (let i = 0; i < data.data.items.length; i++) {
                data.data.items[i].at_time = parseTime(data.data.items[i].at_time)
            }
            atMeList.value = data.data.items
        } else {
            ElMessage.error({message: data.message})
        }
    })
}
getAtMeList()

</script>

<style scoped>

.msg-item {
    display: flex;
    position: relative;
    width: 100%;
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