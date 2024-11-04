<template>
    <h3 style="padding: 0 16px;">{{ title }}</h3>
    <div class="ec-pie" ref="ecPieRef"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import piliTheme from '../../assets/pili-echarts-theme';
// type EChartOption = echarts.EChartsOption;

interface ECPieData {
    value: number,
    name: string
}

const {
    title,
    name,
    dataList
} = defineProps({
    title: String,
    name: String,
    dataList: Array<ECPieData>,
})

const ecPieRef = ref(null)

onMounted(() => {
    const ecPie = echarts.init(ecPieRef.value, piliTheme)
    ecPie.setOption({
        grid: {
            left: '48',
            top: '32',
            right: '16'
        },
        visualMap: [
            {
                show: false,
                min: 0,
                inRange: {}
            }
        ],
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: name,
                type: 'pie',
                center: ['50%', '50%'],
                data: dataList!.sort(function (a, b) {
                    return a.value - b.value;
                }),
                roseType: 'radius',
                animationType: 'scale'
            }
        ]
    })
    window.addEventListener('resize', () => {
        ecPie.resize()
    })
})


</script>

<style scoped>
.ec-pie {
    width: 100%;
    height: 100%;
}
</style>