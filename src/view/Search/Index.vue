<template>

    <!-- 视频结果 -->
    <div v-if="route.query.type === 'video'" class="search-box">
        <el-button text @click="changeHref('video')" type="primary">视频</el-button>
        <el-button text @click="changeHref('bili_user')">用户</el-button>

        <div class="result-box">
            <VideoList v-if="videoData" :data="videoData" />
        </div>
    </div>

    <!-- 用户结果 -->
    <div v-if="route.query.type === 'bili_user'" class="search-box">
        <el-button text @click="changeHref('video')">视频</el-button>
        <el-button text @click="changeHref('bili_user')" type="primary">用户</el-button>

        <div class="result-box">
            <UserList v-if="userData" :data="userData" />
        </div>
    </div>

    <!-- 页码 -->
    <div class="search-page">
        <el-pagination background layout="prev, pager, next" 
        :total="totalPage" 
        @current-change="changePage"/>
    </div>

</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type BiliResType from '../../type/BiliResType'
import { useRoute } from 'vue-router'
import VideoList from './components/VideoList.vue'
import UserList from './components/UserList.vue'
import { fetchData } from '../../utils/fetchData'

const route = useRoute()
// const activeName = ref('video')


const videoData: Ref<null> = ref(null)
const userData: Ref<null> = ref(null)

// const currentPage = ref(1)
const pageNum = ref(1)
const totalPage = ref(null)


// 获取搜索数据
const getSearchData = async (keyword: any, type: any, page: Number) => {
    await fetchData(`/api/search?keyword=${keyword}&type=${type}&page=${page}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            console.log(data.data)

            pageNum.value = data.data.page
            totalPage.value = data.data.numPages

            switch (type) {
                case 'video':
                    videoData.value = data.data.result
                    break
                case 'bili_user':
                    userData.value = data.data.result
                    break
            }
        } else {
            ElMessage({ message: data.message, type: 'error' })
        }
    })
}



const changeHref = (type: String) => {
    window.location.href = `/search?keyword=${route.query.keyword}&type=${type}`
}


watch(() => [
    route.query.keyword,
    route.query.type
], (newValue: any) => {

    let keyword = newValue[0]
    let type = newValue[1]

    console.log(keyword, type)

    getSearchData(keyword, type, 1)
}, {
    immediate: true
})



// 切换页码
const changePage = async (page: number) => {
    // console.log(page)
    await getSearchData(route.query.keyword, route.query.type, page)
}

</script>

<style scoped>
.search-box {
    margin: 90px auto;
    padding-left: 100px;
    padding-right: 30px;
    min-width: 960px;
    max-width: 1660px;
}

.result-box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    /* min-width: 960; */
    max-width: 1660px;
    margin: 30px auto;
    height: auto;
    gap: 16px;
}

.search-page {
    display: flex;
    justify-content: center;
    width: auto;
    height: auto;
    margin: 0 auto 30px;
}
</style>