<template>

    <el-popover 
        :visible="atListVisible"
        placement="top"
        :width="300">

        <template #default>
            <el-input v-model="search" 
                @input="handleSearch(search)">
            </el-input>
            <div class="ar-list">
                <el-scrollbar height="200px">
                    <div v-for="(item, index) in atList" :key="index"
                        class="at-item"
                        @click="handleAt(item.name)">
                        <img :src="`${item.face}@60w.webp`" class="at-face" />
                        <el-text>{{ item.name }}</el-text>
                    </div>
                </el-scrollbar>
            </div>
        </template>

        <template #reference>
            <el-button text size="small" @click="showAtList">
                @
            </el-button>
        </template>

    </el-popover>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { fetchData } from '../utils/fetchData';
import BiliResType from '../type/BiliResType';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';
import { toRefs } from 'vue';


const props = defineProps({
    type: String
})


const {
    USER_COMMENT_TXT,
    USER_COMMENT_CHILD_TXT,
    USER_DYNAMIC_TXT
} = toRefs(useUserStore())


// const value = ref('')
const loading = ref(false)
const atList: Ref<any> = ref(null)
const atListVisible = ref(false)
const search = ref('')


const showAtList = () => {
    atListVisible.value = !atListVisible.value
    handleSearch('')
}



// 防抖查询联系人
let timer: ReturnType<typeof setTimeout>
const handleSearch = (keyword: string) => {
    if (timer) clearTimeout(timer)

    loading.value = true
    timer = setTimeout(async () => {
        await getAtList(keyword)
    }, 200)
}



// 获取联系人列表
const getAtList = async (keyword: string) => {
    await fetchData(`/api/at?keyword=${keyword}`, {
    }, (data: BiliResType) => {
        if (data.code == 0) {
            atList.value = data.data.groups[0].items
        } else {
            ElMessage.warning(data.message)
        }
    })
}



// 评论框加上@所选
const handleAt = (name: string) => {
    if (props.type === 'comment') {
        USER_COMMENT_TXT.value += `@${name} `
    }
    if (props.type === 'child') {
        USER_COMMENT_CHILD_TXT.value += `@${name} `
    }
    if (props.type === 'dynamic') {
        USER_DYNAMIC_TXT.value += `@${name} `
    }
    
    atListVisible.value = false
}

</script>

<style scoped>

.at-item {
    display: flex;
    height: 40px;
    width: 100%;
    border-radius: 8px;
    padding: 8px;
    align-items: center;

    &:hover {
        cursor: pointer;
        background-color: #efefef;
    }
}

.at-face {
    width: 30px;
    height: 30px;
    margin-right: 12px;
    border-radius: 50%;
}



</style>