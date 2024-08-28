<template>
    
    <FansFollowList v-if="followsList" :list="followsList" />

    <div class="page">
        <el-pagination layout="prev, pager, next" 
            :total="50"
            background
            @current-change="changePage"/>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import FansFollowList from '../components/FansFollowList.vue';
import BiliResType from '../../../type/BiliResType';
import { parseTime } from '../../../utils/parseTime';



const route = useRoute()

// 当前页码
const pageNum = ref(1)

const changePage = async (page: number) => {
    pageNum.value = page
    await getFollowsList(page)
}



// 获取关注列表
const followsList = ref(null)
const getFollowsList = async (page: number) => {
    try {
        let res: any = await fetch(`/api/space/follows?mid=${route.params.mid}&page=${page}`)
        let data: BiliResType = await res.json()

        console.log(data)

        if (data.code === 0) {
            for (let i = 0; i < data.data.list.length; i++) {
                data.data.list[i].mtime = parseTime(data.data.list[i].mtime)
            }
            followsList.value = data.data.list
        } else {
            console.log(data)
            ElMessage({message: data.message, type: 'error'})
        }
    } catch (err) {
        ElMessage({message: '服务器连接失败', type: 'error'})
    }
}
getFollowsList(pageNum.value)

</script>

<style scoped>

.page {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

</style>