<template>

    <el-carousel height="250px" class="comment-img_box">
        <el-carousel-item v-for="(item, index) in props.imgList" :key="index"
            @click="viewImg(item.img_src)">
            <img :src="`https://images.weserv.nl/?url=${item.img_src}@500w.webp`" class="comment-img" />
        </el-carousel-item>
    </el-carousel>

    <el-dialog v-model="imgVisible"
        title="查看图片"
        width="532"
        align-center>
        <img :src="imgSrc" />
    </el-dialog>


</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'

const props = defineProps({
    imgList: Array as any
})



// 查看图片
const imgVisible: Ref<boolean> = ref(false)
const imgSrc: Ref<string> = ref('')
const viewImg = (img_src: string) => {
    imgVisible.value = true
    imgSrc.value = `https://images.weserv.nl/?url=${img_src}@500w.webp`
}

</script>

<style scoped>

.comment-img_box {
    width: auto;
    margin-bottom: 16px;
    border-radius: 8px;
}

.comment-img {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: auto;
    border-radius: 8px;
    
    &:hover {
        cursor: pointer;
    }
}
</style>