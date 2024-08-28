<template>

    <div style="width: 120px;">
        <el-button v-if="collected" text size="large" 
            @click="dialogVisible = true"
            style="color: var(--cl-primary)">
            <i>&#xe64c;</i>{{ props.num }}
        </el-button>

        <el-button v-else text size="large" 
            @click="dialogVisible = true">
            <i>&#xe64c;</i>{{ props.num }}
        </el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="添加到收藏夹" size="300">

        <el-checkbox-group v-model="collectList" @change="changeCollectList">
            <el-checkbox v-for="(item, index) in favList" :key="index"
                :value="item.id"
                class="fav-list"
                size="large"
                border>

                <template #default>
                    {{ item.title }}
                    <el-text type="info" class="fav-count">
                        {{ item.media_count }}个视频
                    </el-text>
                </template>

            </el-checkbox>
        </el-checkbox-group>

        <div class="">
            <el-button color="var(--cl-primary)" 
                class="confirm"
                size="large"
                @click="collect">
                确定
            </el-button>
        </div>
        
    </el-dialog>

</template>

<script setup lang="ts">
import { ref, Ref, toRefs } from 'vue';
import BiliResType from '../../../type/BiliResType';
import { ElMessage } from 'element-plus';
import { fetchData } from '../../../utils/fetchData';
import { useUserStore } from '../../../stores/user';

const props = defineProps({
    rid: Number,
    num: Number
})

const {
    info
} = toRefs(useUserStore())



// 检查是否收藏过
const collected: Ref<boolean> = ref(false)
const checkCollected = async () => {
    await fetchData(`/api/video/has/collect?aid=${props.rid}`, {
    }, (data: BiliResType) => {
        if (data.data.favoured) {
            collected.value = true
        } else {
            ElMessage.error({message: data.message})
        }
    })
}
checkCollected()



// 获取用户收藏夹列表
const favList: Ref<Array<any>> = ref([])
const getUserFavList = async () => {
    await fetchData(`/api/space/fav/list?mid=${info.value.mid}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            console.log(data.data)
            favList.value = data.data.list
        } else {
            ElMessage.error({message: data.message})
        }
    })
}
getUserFavList()



// 收藏夹多选框列表
const dialogVisible = ref(false)
const collectList = ref([])
const changeCollectList = async (value: number) => {
    console.log(value)
}



// 收藏视频
const collect = async () => {
    await fetchData(`/api/video/collect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rid: props.rid,
            addId: collectList.value
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success({ message: '收藏成功' })
            dialogVisible.value = false
        } else {
            ElMessage.error({message: data.message})
        }
    })
}

</script>

<style scoped>

.fav-list {
    width: 100%;
    margin-bottom: 16px;
    position: relative;
}

.fav-count {
    position: absolute;
    right: 8px;
}

.confirm {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 160px;
    color: #fff;
}

</style>