<template>

    <div class="list-content">
        <div v-for="(item, index) in props.list" :key="index" 
            class="list">

            <img :src="`https://images.weserv.nl/?url=${item.face}@100w.webp`" />
            
            <div class="list-info">
                <div class="list-name">
                    <RouterLink :to="`/space/${item.mid}/home`">
                        {{ item.uname }}
                    </RouterLink>
                    <el-text type="info">
                        {{ item.mtime }}
                    </el-text>
                </div>

                <div class="list-sign">{{ item.sign }}</div>
            </div>

            <AttrButton 
                :attr="item.attribute"
                :mid="item.mid"/>
            
        </div>
    </div>

    
    

</template>

<script setup lang="ts">
import AttrButton from '../../../components/AttrButton.vue';

const props = defineProps({
    list: Object
})

</script>

<style scoped>

.list-content {
    display: flex;
    flex-flow: row wrap;
    align-items: start;
}

.list {
    display: flex;
    width: 50%;
    height: auto;
    padding: 16px 32px;
    border-bottom: 1px solid #eee;
}

.list img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 16px;
}

.list-info {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-items: start;
    justify-content: space-between;
    height: auto;
}

.list-name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    span {
        margin-left: 16px;
    }
}

.list-sign {
    font-size: 14px;
    color: var(--cl-black-50);
}

</style>