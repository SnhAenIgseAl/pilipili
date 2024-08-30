<template>

    <!-- 透透你的 -->
    <div style="width: 120px;">
        <el-button v-if="hasCoined" text size="large" 
            @click="coinDialogVisible = true"
            style="color: var(--cl-primary);">
            <i>&#xe7ac;</i>{{ coinCount }}
        </el-button>

        <el-button v-else text size="large" 
            @click="coinDialogVisible = true">
            <i>&#xe7ac;</i>{{ coinCount }}
        </el-button>
    </div>

    <!-- 投币数量框 -->
    <el-dialog v-if="!hasCoined" 
        v-model="coinDialogVisible" 
        title="投币数量" 
        :width="600">
        <el-radio-group v-model="coinNum" size="large" class="coin-group">
            <el-radio label="1" value="1" border class="coin-radio" />
            <el-radio label="2" value="2" border class="coin-radio" />
        </el-radio-group>

        <div class="coin-button">
            <el-button type="primary" @click="coin">投 {{ coinNum }} 枚硬币</el-button>
        </div>
        
    </el-dialog>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import { fetchData } from '../../../utils/fetchData';

const props = defineProps({
    aid: Number,
    num: Number
})
const coinCount = ref(props.num!)


const coinDialogVisible = ref(false)
const coinNum = ref('1')



// 投币
const coin = async () => {
    await fetchData(`/api/video/coin?aid=${props.aid}&num=${coinNum.value}`, {  
    }, (data: BiliResType)=> {
        if (data.code === 0) {
            ElMessage({message: '投币成功', type: 'success'})
            coinCount.value += parseInt(coinNum.value)
            hasCoined.value = true
            coinDialogVisible.value = false
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    })
}



// 判断是否被投币
const hasCoined = ref(true)
const hasCoin = async () => {
    await fetchData(`/api/video/has/coin?aid=${props.aid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            if (!data.data.multiply) {
                hasCoined.value = false
            }
        } else {
            ElMessage({message: data.message, type: 'error'})
        }
    })
}
hasCoin()

</script>

<style scoped>
.coin-group {
    display: flex;
    justify-content: center;
}
.coin-radio {
    flex: 1;
    height: 100px;
}

.coin-button {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}
</style>