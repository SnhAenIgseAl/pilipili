<template>
    <h3 style="padding: 0 16px;">{{ title }}</h3>
    <div class="ec-line" ref="ecLineRef"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import piliTheme from '../../assets/pili-echarts-theme';

const {
    title,
    name,
    showSymbol,
    xAxis,
    yAxis,
} = defineProps({
    title: String,
    name: String,
    showSymbol: Boolean,
    xAxis: Array,
    yAxis: Array,
})

const ecLineRef = ref(null)

onMounted(() => {
    const ecLine = echarts.init(ecLineRef.value, piliTheme)
    ecLine.setOption({
        grid: {
            left: '48',
            top: '32',
            right: '16'
        },
        visualMap: [
            {
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: 40,
            }
        ],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: xAxis as Array<string>,
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {},
        dataZoom: [
            {
                type: 'inside',
                start: 80,
                end: 100
            },
            {
                start: 0,
                end: 0
            }
        ],
        series: [
            {
                name: name,
                type: 'line',
                showSymbol: showSymbol,
                smooth: false,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {
                                offset: 1,
                                color: 'rgba(255,255,255,0)'
                            },
                            {
                                offset: 0,
                                color: 'rgb(252,156,184)'
                            }
                        ]
                    )
                },
                data: yAxis as Array<number>
            }
        ]
    })
    window.addEventListener('resize', () => {
        ecLine.resize()
    })
})


</script>

<style scoped>
.ec-line {
    width: 100%;
    height: 100%;
}
</style>