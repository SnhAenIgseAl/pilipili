<template>

    <div v-if="opusInfo" class="main-box">
        <Card 
            :id_str="opusInfo.id_str"
			:basic="opusInfo.basic"
			:author="opusInfo.modules.module_author"
			:dynamic="opusInfo.modules.module_dynamic"
			:more="opusInfo.modules.module_more"
			:stat="opusInfo.modules.module_stat"
			:orig="opusInfo.orig"
        />
    </div>
    <el-empty v-else description="动态不见了" />


</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchData } from '../../utils/fetchData';
import BiliResType from '../../type/BiliResType';
import { ElMessage } from 'element-plus';
import Card from '../../components/Card/Card.vue';

const route = useRoute()

const opusInfo: Ref<any> = ref(null)
const loading: Ref<boolean> = ref(true)
const getOpusInfo = async () => {
    await fetchData(`/api/opus?id=${route.params.id}`, {
    }, (data: BiliResType) => {
        if (data.code === 0) {
            opusInfo.value = data.data.item
        } else {
            ElMessage.error(data.message)
        }
        loading.value = false
    })
}
getOpusInfo()

</script>

<style scoped>

</style>