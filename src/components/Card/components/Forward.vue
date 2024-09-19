<template>

    <el-button text @click="forwardVisible = true">
        <i>&#xe6eb;</i>{{ props.num }}{{ props.txt }}
    </el-button>

    <el-dialog v-model="forwardVisible" title="转发动态" :width="600">

        <el-input v-model="dynamicTxt" 
            :placeholder="dftTxt" 
            resize="none" 
            rows="3"
            type="textarea" />

        <el-button color="var(--cl-primary)"
            class="confirm"
            :loading="loading"
            @click="forward">
            转发
        </el-button>

    </el-dialog>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { fetchData } from '../../../utils/fetchData';
import BiliResType from '../../../type/BiliResType';
import { ElMessage } from 'element-plus'

const props = defineProps({
    dynId: String,  // 动态id
    txt: String,    // 按钮自定义文字
    num: Number,    // 转发数
    scene: Number   // 4为动态转发，5为视频动态转发
})


const forwardVisible: Ref<boolean> = ref(false)
const dynamicTxt: Ref<''> = ref('')
const dftTxt: Ref<'转发动态'> = ref('转发动态')
const loading: Ref<boolean> = ref(false)

// 转发动态
const forward = async () => {
    loading.value = true

    await fetchData(`/api/dynamic/forward`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dynamicTxt: dynamicTxt.value || '转发动态',
            dyn_id_str: props.dynId,
            scene: props.scene
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success('转发成功')
            forwardVisible.value = false
            loading.value = false
        } else {
            ElMessage.error(data)
            loading.value = false
        }
    })
}


</script>

<style scoped>

.confirm {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    color: #fff;
    margin-top: 16px;
}

</style>