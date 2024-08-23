<template>
    <div class="statistic-info">
        <el-statistic title="粉丝数" :value="props.info?.card.fans"></el-statistic>
        <el-statistic title="关注数" :value="props.info?.card.friend"></el-statistic>
        <el-statistic title="点赞量" :value="props.info?.like_num"></el-statistic>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    info: Object
})

</script>

<style scoped>

.statistic-info {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 20%;
    height: auto;
    margin: 32px 0;
}

</style>

<style>
.el-statistic__head {
    color: var(--cl-white-75) !important;
}

.el-statistic__content {
    text-align: center;
    color: var(--cl-white) !important;
}
</style>