<template>

    <div class="data-content">

        <div style="margin-bottom: 16px; width: 100%;">
            <TotalStat />
        </div>

        <div v-if="videoXAxis.length && videoTrend.length" 
            style="width: 100%;"
            class="view-data">
            <ECLine 
                title="近30天播放量"
                name="播放量"
                :showSymbol="true"
                :xAxis="videoXAxis"
                :yAxis="videoTrend" >
            </ECLine>
        </div>
        <div v-if="videoViewProp.length" class="view-data">
            <ECPie 
                title="播放占比"
                name="播放"
                :dataList="videoViewProp">
            </ECPie>
        </div>
        <div v-if="videoLikeProp.length" class="view-data">
            <ECPie 
                title="点赞占比"
                name="点赞"
                :dataList="videoLikeProp">
            </ECPie>
        </div>
        <div v-if="videoCommentProp.length" class="view-data">
            <ECPie 
                title="评论占比"
                name="评论"
                :dataList="videoCommentProp">
            </ECPie>
        </div>
        <div v-if="videoBase.length" class="view-data">
            <ECPie 
                title="粉丝播放占比"
                name="粉丝播放"
                :dataList="videoBase">
            </ECPie>
        </div>
        
        

        
    </div>
    

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fetchData } from '../../utils/fetchData'
import TotalStat from './components/TotalStat.vue'
import BiliResType from '../../type/BiliResType';
import { parseTime } from '../../utils/parseTime'
import { ElMessage } from 'element-plus'
import ECLine from '../../components/Echarts/ECLine.vue'
import ECPie from '../../components/Echarts/ECPie.vue'


const videoTrend: any = ref([])
const videoXAxis: any = ref([])

const getVideoTrend = async () => {
    await fetchData(`/api/dataUp/video/trend?period=1`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            let play = data.data.data_tendency.play

            for (let i = 0; i < play.length; i++) {
                let time = parseTime(play[i].date_key)
                videoTrend.value.push(play[i].total_inc)
                videoXAxis.value.push(time)
            }
        } else {
            ElMessage.error(data.message)
        }
    })
}
getVideoTrend()



const videoViewProp: any = ref([])
const videoLikeProp: any = ref([])
const videoCommentProp: any = ref([])

const getVideoProp = (type: number) => {
    return new Promise<unknown>(async (resolve) => {
        await fetchData(`/api/dataUp/video/prop?type=${type}`, {
        }, (data: BiliResType) => {
            if (data.code === 0) {
                let res = data.data
                let arc_inc = res[Object.keys(res)[0]].arc_inc
                let list = []

                for (let i = 0; i < arc_inc.length / 2; i++) {
                    if (arc_inc[i].incr === 0) {
                        continue
                    }
                    list[i] = {
                        value: arc_inc[i].incr,
                        name: arc_inc[i].title
                    }
                }
                resolve(list)
            } else {
                ElMessage.warning(data.message)
            }
        })
    })
}

const getAllVideoProp = async () => {
    videoViewProp.value = await getVideoProp(1)
    videoLikeProp.value = await getVideoProp(8)
    videoCommentProp.value = await getVideoProp(3)
}
getAllVideoProp()



const videoBase: any = ref([])
const getVideoBase = async () => {
    await fetchData(`/api/dataUp/video/base`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            let fanTotal = 0
            let notFanTotal = 0
            let obj = data.data.viewer_area.fan
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    fanTotal += obj[key]
                }
            }
            obj = data.data.viewer_area.not_fan
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    notFanTotal += obj[key]
                }
            }

            videoBase.value[0] = {
                name: '粉丝',
                value: fanTotal,
            }
            videoBase.value[1] = {
                name: '路人',
                value: notFanTotal,
            }
        } else {
            ElMessage.warning(data.message)
        }
    })
}
getVideoBase()


</script>

<style scoped>

.data-content {
    display: flex;
    flex-flow: row wrap;
    padding-top: 76px;
    padding-left: 70px;
    min-width: 960px;
}

.view-data {
    width: 50%;
    height: 300px;
    margin-bottom: 48px;
}

.pie-content {
    position: absolute;
    width: 100%;
    height: 300px;
}

</style>