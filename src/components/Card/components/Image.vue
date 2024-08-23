<template>
    <el-carousel 
        v-if="porps.draw"
        height="500px"
        trigger="click" 
        :autoplay="false"
        class="draw-image" 
    >
        <el-carousel-item 
            v-for="(item, index) in porps.draw.items" :key="index" 
            class="draw-carousel">

            <el-button text size="small" @click="viewImg(item.src)">
                查看原图
            </el-button>

            <img :src="`https://images.weserv.nl/?url=${item.src}@1000h.webp`" class="draw-item"/>
        </el-carousel-item>
    </el-carousel>
</template>

<script setup lang="ts">

const porps = defineProps({
    draw: Object
})



// 查看原图
const viewImg = (url: string) => {
    window.open(url)
}

</script>

<style scoped>
.draw-image {
    width: 100%;
    margin: 10px 0 0;
    border-radius: 5px;
}

.draw-carousel {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.draw-item {
    margin: 0 auto;
    display: flex;
    /* align-items: center; */
    /* justify-content: center; */
    height: 500px;
    border-radius: 5px;
}
</style>