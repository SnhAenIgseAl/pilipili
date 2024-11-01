<template>

    <!-- 关系（对于自己）按钮 -->
    <el-button v-if="attr === 0" @click="follow">
        未关注
    </el-button>
    <el-button v-if="attr === 2" 
        type="primary" 
        color="var(--cl-primary)"
        :style="{color: '#fff'}"
        @click="unfollow">
        已关注
    </el-button>
    <el-button v-if="attr === 6" 
        type="primary" 
        color="var(--cl-primary)"
        :style="{color: '#fff'}"
        @click="unfollow">
        已互粉
    </el-button>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import BiliResType from '../type/BiliResType';
import { fetchData } from '../utils/fetchData';



const props = defineProps({
    attr: Number,   // 0：未关注 2：已关注 6：已互粉 128：已拉黑
    mid: Number     // 用户id 
})

const attr = ref(props.attr)
console.log(props.attr)



// 关注用户
const follow = async () => {
    await fetchData(`/api/follow?mid=${props.mid}`, {
        method: 'POST'
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success({ message: '关注成功' })
            getRelation()
        } else {
            ElMessage.error({message: data.message})
        }
    })
}



// 取关用户
const unfollow = async () => {
    await fetchData(`/api/unfollow?mid=${props.mid}`, {
        method: 'POST'
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success({ message: '取关成功' })
            getRelation()
        } else {
            ElMessage.error({message: data.message})
        }
    })
}



// 查询用户与自己的关系
const getRelation = async () => {
    await fetchData(`/api/relation?mid=${props.mid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            attr.value = data.data.relation.attribute
        } else {
            ElMessage.error({message: data.message})
        }
    })
}
// getRelation()

</script>

<style scoped>
</style>