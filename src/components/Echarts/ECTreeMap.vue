<template>

    <div class="ec-treemap" ref="ecTreeMapRef"></div>

</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import piliTheme from '../../assets/pili-echarts-theme';
import { ref } from 'vue';
import { onMounted } from 'vue';

const {
    name,
    dataList,
} = defineProps({
    name: String,
    dataList: Array
})

const ecTreeMapRef = ref(null)    

onMounted(() => { 
    const ecTreeMap = echarts.init(ecTreeMapRef.value, piliTheme)
    ecTreeMap.setOption({
        tooltip: {},
        series: [
            {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                roam: false,
                name: name,
                type: 'treemap',
                data: dataList as any[]
            }
        ]
    })
    window.addEventListener('resize', () => {
        ecTreeMap.resize()
    })
})

</script>

<style scoped>

.ec-treemap {
    width: 100%;
    height: 100%;
}
</style>