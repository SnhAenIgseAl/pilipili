<template>

    <el-popover
        placement="bottom"
        :width="60"
        trigger="click">

        <template #reference>
            <el-button text class="more-button">
                <i style="margin-right: 0;">&#xe6a5;</i>
            </el-button>
        </template>

        <template #default>

            <div v-for="(item, index) in props.more?.three_point_items" :key="index"
                @click="doMore(item.label)">
                <div class="more-item">
                    {{ item.label }}
                </div>

                <el-dialog v-if="item.label === '删除'" v-model="dialogVisible" :title="item.modal.title">
                    {{ item.modal.content }}

                    <template #footer>
                        <el-button type="danger" @click="delDynamic(item.params)">
                            {{ item.modal.confirm }}
                        </el-button>
                    </template>
                    
                </el-dialog>
            </div>

            
        </template>

    </el-popover>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { fetchData } from '../../../utils/fetchData';
import { ElMessage } from 'element-plus';
import BiliResType from '../../../type/BiliResType';

const props = defineProps({
    more: Object
})


const dialogVisible: Ref<boolean> = ref(false)

// 动态更多操作
const doMore = (type: string) => {

    if (type === '删除') {
        dialogVisible.value = true
    }
}



// 删除动态
const delDynamic = async (dyn: string) => {
    await fetchData(`/api/dynamic/del`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dyn: dyn
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success({message: '删除成功'})
            dialogVisible.value = false
        } else {
            ElMessage.error({message: data.message})
        }
    })
}

</script>

<style scoped>

.more-button {
    position: absolute;
    right: 16px;
    top: 24px;
}

.more-item {
    line-height: 30px;
}

</style>