<template>
    <div v-if="info" class="popover-box">

        <div style="color: var(--cl-primary);">
            {{ props.pub!.name }}
            <Level :level="5" />
            <img v-if="info.card.vip.status"
                :src="`https://images.weserv.nl/?url=${info.card.vip.label.img_label_uri_hans_static}`" class="vip-img" />
        </div>

        <div class="popover-stat">
            <el-text>{{ info.card.fans }}<el-text type="info">粉丝</el-text></el-text>
            <el-text>{{ info.card.friend }}<el-text type="info">关注</el-text></el-text>
            <el-text>{{ info.card.like_num }}<el-text type="info">获赞</el-text></el-text>
        </div>

        <el-text type="info">
            {{ info.card.sign }}
        </el-text>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type BiliResType from '../../../type/BiliResType'
import Level from '../../Level.vue';

const props = defineProps({
    pub: Object
})


const info: any = ref(null)
const getInfo = async () => {
    try {
        let res = await fetch(`/api/popover?mid=${props.pub!.mid}`)
        let data: BiliResType = await res.json()

        if (data.code === 0) {
            info.value = data.data
        }
    } catch (err) {
        ElMessage({ message: '网络未连接', type: 'error' })
    }
}
getInfo()

</script>

<style scoped>
.vip-img {
    height: 24px;
    margin-left: 8px;
}

.popover-stat {
    margin: 8px 0;

    .el-text {
        margin-right: 8px;
    }


}
</style>