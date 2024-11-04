<template>

    <div class="labelled-content">

        <div class="labelled-input">
            <el-input 
                v-model="mid" 
                size="large" 
                maxlength="16"
                placeholder="用户mid"
                clearable>
            </el-input>

            <el-button 
                type="primary" 
                size="large"
                color="var(--cl-primary)"
                :style="{color: '#fff'}"
                @click="search(mid)">
                搜索
            </el-button>
            
        </div>

        <div v-show="showed" class="result-content">
            <el-skeleton 
                :rows="USER_LABELLED_LIST.length" 
                :loading="loading" 
                animated>

                <template #default>

                    <el-divider content-position="left">
                        <h3>成分清单</h3>
                    </el-divider>

                    <div style="width: 100%; height: 300px;">
                        <ECTreeMap v-if="result.length" 
                            name="成分清单"
                            :dataList="result">
                        </ECTreeMap>
                    </div>

                    <!-- <el-scrollbar height="300px">
                        <el-space 
                            direction="vertical" 
                            alignment="start">
                            <el-text v-for="(item, index) in USER_LABELLED_LIST"
                                :key="index"
                                type="info">
                                {{ result[index] }}条{{ item }}相关动态 
                            </el-text><br />
                        </el-space>
                    </el-scrollbar> -->
                    
                </template>

            </el-skeleton>  
        </div>
        
    </div>

</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchData } from '../../utils/fetchData'
import BiliResType from '../../type/BiliResType'
import labelled from '../../utils/labelled'
import { useSettingStore } from "../../stores/setting"
import { storeToRefs } from 'pinia'
import ECTreeMap from '../../components/Echarts/ECTreeMap.vue'


const {
	USER_LABELLED_LIST
} = storeToRefs(useSettingStore())



const mid = ref('')
const result: Ref<any[]> = ref([])
const dynamicList: Ref<any[]> = ref([])
const loading = ref(false)
const showed = ref(false)
const hasMore = ref(true)
const lastId = ref('')



const search = async (mid: string) => {

    dynamicList.value = []
    lastId.value = ''
    hasMore.value = true

    if (!mid) {
        ElMessage.warning('请输入用户mid')
        return
    }

    if (!showed.value)		showed.value = true
    loading.value = true

    await getDynamic(mid, lastId.value)

    result.value = labelled(dynamicList.value)
    console.log(result.value)
}



const getDynamic = async (mid: string, offset: string) => {
    await fetchData(`/api/space/dynamic?mid=${mid}&offset=${offset}`, {
	}, async (data: BiliResType) => {
        if (data.code === 0) {

            if (!hasMore.value) {
                loading.value = false
                return 
            }

            if (!data.data.items.length) {
                loading.value = false
                ElMessage.warning('该用户没有动态')
                return
            }

            // 记录最后一条动态的id
			lastId.value = data.data.items[data.data.items.length - 1].id_str

            // 判断是否还有更多动态
            hasMore.value = data.data.hasMore

            if (offset === '') {
                dynamicList.value  = data.data.items
            } else {
                let list = [...dynamicList.value, ...data.data.items]
                dynamicList.value = list
            }

            await sleep(100)
            await getDynamic(mid, lastId.value)
		} else {
			ElMessage.error(data.message)
		}
	})
}



function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

</script>

<style scoped>

.labelled-content {
	min-width: 480px;
	max-width: 720px;
    padding-top: 246px;
	padding-left: 86px;
    padding-right: 16px;
	margin: 0 auto;
	height: 500px;
	background: unset !important;

    .labelled-input {
        display: flex;
    }
}

.result-content {
    margin-top: 16px;
}
</style>