<template>
    
    <FansFollowList v-if="fansList" :list="fansList" />

    <div class="page">
        <el-pagination layout="prev, pager, next" 
            :total="total"
            :default-page-size="50"
            background
            @current-change="changePage"/>
    </div>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import FansFollowList from '../components/FansFollowList.vue';
import BiliResType from '../../../type/BiliResType';
import { parseTime } from '../../../utils/parseTime';
import { fetchData } from '../../../utils/fetchData';



const route = useRoute()

// 当前页码
const pageNum = ref(1)

const changePage = async (page: number) => {
    pageNum.value = page
    await getFansList(page)
}



// 获取粉丝列表
const fansList = ref(null)
const total: Ref<number> = ref(0)
const getFansList = async (page: number) => {
    await fetchData(`/api/space/fans?mid=${route.params.mid}&page=${page}`, {},
        (data: BiliResType) => {
            console.log(data)

            if (data.code === 0) {
                for (let i = 0; i < data.data.list.length; i++) {
                    data.data.list[i].mtime = parseTime(data.data.list[i].mtime)
                }
                fansList.value = data.data.list
                total.value = data.data.total
            } else {
                console.log(data)
                ElMessage.error(data.message)
            }
        })
}
getFansList(pageNum.value)

</script>

<style scoped>

.page {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

</style>