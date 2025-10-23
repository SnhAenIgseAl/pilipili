<template>

    <div v-for="(item, index) in props.data" :key="index" class="list-item">
        
        <!-- 头像 -->
        <img :src="`https:${item.upic}@160w.webp`" class="upic" />
        
        <!-- 信息 -->
        <div class="list-info">

            <div class="uname">
                <RouterLink :to="`/space/${item.mid}/home`">
                    {{ item.uname }}
                </RouterLink>

                <el-text v-if="item.official_verify.desc" type="info">
                    <el-divider direction="vertical" />
                    {{ item.official_verify.desc }}
                </el-text>
            </div>
            

            <el-text type="info">{{ item.fans }}粉丝</el-text>
            <el-text type="info"> · {{ item.videos }}视频</el-text><br />

            <div class="follow-button">
                <el-button>关注</el-button>
            </div>
            
        </div>
        

    </div>

</template>

<script setup lang="ts">

const props = defineProps({
    data: Object
})

</script>

<style scoped>

.list-item {
    display: flex;
    align-items: center;
    width: 50%;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
}

.upic {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.list-info {
    margin-left: 16px;
}

.uname {
    margin-bottom: 8px;
}

.follow-button {
    margin-top: 8px;
}

</style>