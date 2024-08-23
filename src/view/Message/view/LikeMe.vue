<template>

    <el-timeline>

        <!-- 最近 -->
        <el-timeline-item
            v-for="(item, index) in latestList" :key="index"
            type="primary"
            size="large"
            :hollow="true"
            :timestamp="item.like_time"
            placement="top">

            <MsgItemList 
                type="like"
                :users="item.users"
                :counts="item.counts"
                :business="item.item.business"
                :root="item.item.title"
                :image="item.item.image">
            </MsgItemList>
            
        </el-timeline-item>


        <!-- 以往 -->
        <el-timeline-item
            v-for="(item, index) in likeList" :key="index"
            type="primary"
            size="large"
            :hollow="true"
            :timestamp="item.like_time"
            placement="top">

            <MsgItemList 
                type="like"
                :users="item.users"
                :counts="item.counts"
                :business="item.item.business"
                :root="item.item.title"
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


// 获取点赞我的列表
const likeList: any = ref(null)
const latestList: any = ref(null)
const getLikeList = async () => {
    await fetchData(`/api/message/like`, {
    }, (data: BiliResType) => {
        console.log(data)
        if (data.code === 0) {
            for (let i = 0; i < data.data.total.items.length; i++) {
                data.data.total.items[i].like_time = parseTime(data.data.total.items[i].like_time)
            }
            for (let i = 0; i < data.data.latest.items.length; i++) {
                data.data.latest.items[i].like_time = parseTime(data.data.latest.items[i].like_time)
            }
            likeList.value = data.data.total.items
            latestList.value = data.data.latest.items
        } else {
            ElMessage.error({message: data.message})
        }
    })
}
getLikeList()

</script>

<style scoped>

</style>