<template>

    <el-tabs v-if="favList.favName"
        v-model="activeName"
        @tab-click="switchTabs"
        tab-position="left" 
        style="height: auto" 
        class="fav-tabs">

        <el-tab-pane v-for="(item, index) in favList.favName" :key="index" 
            :name="item.id"
            :label="item.title">

            <!-- 收藏夹视频列表 -->
            <div class="video-list" style="margin-left: 32px;">
                <div v-for="(j, idx) in favList.favVideoInfo[index]?.medias" :key="idx" 
                    class="video-item"
                    :style="{ backgroundImage: `url(${j.cover}@600w.webp)` }">
                    <RouterLink :to="`/video/${j.bvid}`">
                        <div class="video-info">
                            <div class="video-title">
                                {{ j.title }}
                            </div>
                            <div class="video-stat">   
                                收藏于 {{ j.fav_time }} 
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </div>

            <div class="page">
                <el-pagination layout="prev, pager, next" 
                    :total="favList.favVideoInfo[index]?.info.media_count"
                    :page-size="20"
                    background
                    @current-change="changePage"/>
            </div>
            
            
        </el-tab-pane>

        
    </el-tabs>

    <el-empty v-else description="该用户暂无收藏夹" />

</template>

<script setup lang="ts">
import { ref, Ref, Reactive, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import type BiliResType from '../../../type/BiliResType';
import type { TabsPaneContext } from 'element-plus'
import { parseTime } from '../../../utils/parseTime';
import { fetchData } from '../../../utils/fetchData';



const route = useRoute()

interface FavListType {
    favName: Array<any>,
    favVideoInfo: Reactive<any>
}

const favList: Reactive<FavListType> = reactive({
    favName: [],
    favVideoInfo: reactive({})
})
const activeName = ref(null)
    



// 获取收藏夹列表
const getFavList = async () => {
    await fetchData(`/api/space/fav/list?mid=${route.params.mid}`, {
    }, (data: BiliResType) => {
        if (data.data) {
            activeName.value = data.data.list[0].id
            favId.value = data.data.list[0].id
            favList.favName = data.data.list
            for (let i = 0 ; i < data.data.list.length; i++) {
                getFavVideoList(i, data.data.list[i].id, 1)
            }
            // console.log(favList)
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    })
}
getFavList()
console.log(favList)



// 获取收藏夹视频列表
const getFavVideoList = async (index: number, media_id: number, page: number) => {
    await fetchData(`/api/space/fav/video?media_id=${media_id}&page=${page}`, {
    }, (data: BiliResType) => {
        if (data.code == 0) {
            for (let i = 0; i < data.data.medias.length; i++) {
                data.data.medias[i].fav_time = parseTime(data.data.medias[i].fav_time)
            }
            favList.favVideoInfo[index] = data.data
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    })
}



// 切换收藏夹
const favId: Ref<any> = ref('')
const favIndex: Ref<any>  = ref('')
const switchTabs = (pane: TabsPaneContext) => {
    favIndex.value = pane.index
    favId.value = pane.props.name
    // console.log(pane.index)
}



// 翻页
const pageNum: Ref<number> = ref(1)
const changePage = async (page: number) => {
    pageNum.value = page
    await getFavVideoList(favIndex.value, favId.value, page)
}


</script>

<style scoped>

.page {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

</style>