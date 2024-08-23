<template>
    
    <div class="decorate">
        <img :src="`https://images.weserv.nl/?url=${props.decorate!.card_url}@100h.webp`" class="card-url" />
        <div class="fan-number" :style="{color: `${props.decorate!.fan.color}`}">No. {{ props.decorate!.fan.number }}</div>
    </div>

</template>

<script setup lang="ts">

const props = defineProps({
    decorate: Object
})

</script>

<style scoped>

.decorate {
    position: absolute;
    top: 16px;
    right: 16px;
    width: auto;
    height: 50px;
}

.card-url {
    height: 100%;
}

.fan-number {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
}

</style>